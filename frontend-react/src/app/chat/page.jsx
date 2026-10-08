'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import ChatInput from '@/components/chat/ChatInput';
import ChatHistory from '@/components/chat/ChatHistory';
import ChatHistorySidebar from '@/components/chat/ChatHistorySidebar';
import ChatMessage from '@/components/chat/ChatMessage';
import ErrorModal from '@/components/chat/ErrorModal';
//import DataService from "../../services/MockDataService"; // Mock
import DataService from "../../services/DataService";
import { uuid } from "../../services/Common";


// Import the styles
import styles from "./styles.module.css";

export default function ChatPage({ searchParams }) {
    const params = use(searchParams);
    const chat_id = params.id;
    const model = params.model || 'llm';
    console.log(chat_id, model);

    // Component States
    const [chatId, setChatId] = useState(params.id);
    const [hasActiveChat, setHasActiveChat] = useState(false);
    const [chat, setChat] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedModel, setSelectedModel] = useState(model);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchChat = async (id) => {
        try {
            setChat(null);
            const response = await DataService.GetChat(model, id);
            setChat(response.data);
            console.log(chat);
        } catch (error) {
            console.error('Error fetching chat:', error);
            setChat(null);
        }
    };

    // Setup Component
    useEffect(() => {
        if (chat_id) {
            fetchChat(chat_id);
            setHasActiveChat(true);
        } else {
            setChat(null);
            setHasActiveChat(false);
        }
    }, [chat_id]);
    useEffect(() => {
        setSelectedModel(model);
    }, [model]);

    function tempChatMessage(message) {
        // Set temp values
        message["message_id"] = uuid();
        message["role"] = 'user';
        if (chat) {
            // Append message
            var temp_chat = { ...chat };
            temp_chat["messages"].push(message);
        } else {
            var temp_chat = {
                "messages": [message]
            }
            return temp_chat;
        }
    }

    // Handlers
    const newChat = (message) => {
        console.log(message);
        // Start a new chat and submit to LLM
        const startChat = async (message) => {
            try {
                // Show typing indicator
                setIsTyping(true);
                setHasActiveChat(true);
                setChat(tempChatMessage(message)); // Show the user input message while LLM is invoked

                // Submit chat
                const response = await DataService.StartChatWithLLM(model, message);
                console.log(response.data);

                // Hide typing indicator and add response
                setIsTyping(false);

                setChat(response.data);
                setChatId(response.data["chat_id"]);
                router.push('/chat?model=' + selectedModel + '&id=' + response.data["chat_id"]);
            } catch (error) {
                console.error('Error fetching chat:', error);
                setError(error);
                setIsTyping(false);
                setChat(null);
                setChatId(null);
                setHasActiveChat(false);
                router.push('/chat?model=' + selectedModel);
            }
        };
        startChat(message);

    };
    const appendChat = (message) => {
        console.log(message);
        // Append message and submit to LLM

        const continueChat = async (id, message) => {
            try {
                // Show typing indicator
                setIsTyping(true);
                setHasActiveChat(true);
                tempChatMessage(message);

                // Submit chat
                const response = await DataService.ContinueChatWithLLM(model, id, message);
                console.log(response.data);

                // Hide typing indicator and add response
                setIsTyping(false);

                setChat(response.data);
                forceRefresh();
            } catch (error) {
                console.error('Error fetching chat:', error);
                setError(error);
                setIsTyping(false);
                setChat(null);
                setHasActiveChat(false);
            }
        };
        continueChat(chat_id, message);
    };
    // Force re-render by updating the key
    const forceRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    const handleModelChange = (newValue) => {

        setSelectedModel(newValue);
        var path = '/chat?model=' + newValue;
        if (chat_id) {
            path = path + '&id=' + chat_id;
        }
        router.push(path)
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ErrorModal
                error={error}
                onClose={() => setError(null)}
            />
            {/* Hero Section */}
            {!hasActiveChat && (
                <section
                    className="relative min-h-[400px] flex items-center justify-center px-4 py-16 text-center text-white"
                    style={{
                        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/assets/hero_background.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="w-full max-w-2xl mx-auto pt-16 md:pt-20">
                        <h1 className="text-3xl md:text-5xl font-playfair mb-6">Cheese Assistant 🌟</h1>
                        {/* Main Chat Input: ChatInput */}
                        <div className="w-full max-w-2xl mx-auto rounded-xl p-4 md:p-4">
                            <ChatInput onSendMessage={newChat} className={styles.heroChatInputContainer} selectedModel={selectedModel} onModelChange={handleModelChange}></ChatInput>
                        </div>

                    </div>
                </section>
            )}

            {/* Chat History Section: ChatHistory */}
            {!hasActiveChat && (
                <div className="flex-1">
                    <ChatHistory model={model} />
                </div>
            )}

            {/* Chat Block Header Section */}
            {hasActiveChat && (
                <div className={styles.chatHeader}></div>
            )}
            {/* Active Chat Interface */}
            {hasActiveChat && (
                <>
                    {/* Mobile Header with Toggle */}
                    <div className="md:hidden bg-black/90 h-10 md:h-10 flex items-center px-4 md:px-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white p-2"
                        >
                            <ReadMoreIcon></ReadMoreIcon>
                        </button>
                    </div>

                    <div className="flex flex-1 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
                        {/* ChatHistorySidebar - Hidden on mobile by default */}
                        <div className={`
                            fixed inset-0 z-40 md:relative md:translate-x-0 transform transition-transform duration-300 ease-in-out
                            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:block md:w-64 lg:w-80 bg-neutral-700
                        `}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <ChatHistorySidebar
                                chat_id={chat_id}
                                model={model}
                                onClose={() => setIsSidebarOpen(false)}
                            />
                        </div>

                        {/* Overlay for mobile sidebar */}
                        {isSidebarOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                                onClick={() => setIsSidebarOpen(false)}
                            />
                        )}

                        {/* Main chat area */}
                        <div className="flex-1 flex flex-col bg-gray-800">
                            {/* Chat message: ChatMessage */}
                            <ChatMessage chat={chat} key={refreshKey} isTyping={isTyping} model={model}></ChatMessage>
                            {/* Sticky chat input area: ChatInput */}
                            <div>
                                <ChatInput
                                    onSendMessage={appendChat}
                                    chat={chat}
                                    selectedModel={selectedModel}
                                    onModelChange={setSelectedModel}
                                    disableModelSelect={true}
                                ></ChatInput>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}