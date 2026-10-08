'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import DataService from "../../services/DataService";

export default function Newsletter() {
    const [newsletters, setNewsletters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DataService.GetNewsletters(4);
                setNewsletters(response.data);
            } catch (error) {
                console.error('Error fetching newsletters:', error);
                setNewsletters([]);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="py-16 md:py-20 px-4 md:px-6 max-w-7xl mx-auto bg-white" id="newsletters">
            <h2 className="text-3xl md:text-4xl text-center font-playfair text-gray-800 mb-4">
                Newsletters
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
                <div className="space-y-6">
                    {newsletters.map((newsletter) => (
                        <article
                            key={newsletter.id}
                            className="p-6 md:p-8 bg-white rounded-lg shadow-sm hover:shadow-md 
                                     hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                                <span>{newsletter.date}</span>
                                <span>{newsletter.readTime}</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-playfair text-gray-800 mb-4">
                                {newsletter.title}
                            </h3>

                            <p className="text-gray-600 mb-4 line-clamp-3">
                                {newsletter.excerpt}
                            </p>

                            <Link
                                href={`/newsletters?id=${newsletter.id}`}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                            >
                                Read More →
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="order-first lg:order-last">
                    <div className="flex justify-center lg:justify-start">
                        <Image
                            src="/assets/newsletter.png"
                            alt="Newsletter Icon"
                            width={240}
                            height={240}
                            className="w-48 h-48 md:w-60 md:h-60 lg:w-full lg:h-auto"
                        />
                    </div>
                    <h3 className="text-xl md:text-2xl text-gray-800 mt-6 mb-4 text-center lg:text-left">
                        About Newsletters
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center lg:text-left">
                        Welcome to Formaggio.me's Cheese Chronicles, your weekly digest of all things cheese!
                        Our newsletters dive deep into the fascinating world of artisanal cheese-making,
                        featuring expert insights, tasting notes, and the latest innovations in cheese technology.
                        From traditional techniques to AI-powered cheese analysis, we explore the intersection of
                        time-honored craftsmanship and modern innovation. Whether you're a cheese professional,
                        enthusiast, or just beginning your cheese journey, our newsletters provide valuable insights,
                        pairing suggestions, and behind-the-scenes looks at the world's finest cheeses. Stay informed,
                        inspired, and connected to the global cheese community with our weekly updates!
                    </p>
                </div>
            </div>

            <div className="text-center mt-12">
                <Link
                    href="/newsletters"
                    className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white 
                             font-medium rounded transition-colors duration-200"
                >
                    View All Newsletters
                </Link>
            </div>
        </section>
    );
}