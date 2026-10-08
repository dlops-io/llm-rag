import Image from 'next/image';

export default function WhatIs() {
    return (
        <section className="py-16 md:py-20 px-4 md:px-6 max-w-7xl mx-auto bg-white">
            <h2 className="text-3xl md:text-4xl text-center font-playfair text-gray-800 mb-4">
                Ready for formaggio.me!
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-12">
                <div className="prose max-w-none">
                    <h3 className="text-2xl md:text-3xl font-playfair text-gray-800 mb-6">
                        Discover the world of cheese with formaggio.me!
                    </h3>

                    <p className="text-gray-600 mb-4">
                        Imagine being able to identify a cheese by simply taking a photo of it. Our app uses <strong>AI-powered</strong> visual
                        recognition technology to help you identify the cheese you're looking at, and then provides you with a
                        wealth of information about it.
                    </p>

                    <p className="text-gray-600 mb-4">
                        Take a photo of the cheese, and our app will identify it for you. Then, dive deeper into the world of cheese
                        with our interactive chatbot. Ask questions about the cheese's origin, production process, nutritional
                        information, and history.
                    </p>

                    <p className="text-gray-600 mb-4">
                        Want to host a cheese-tasting party? Formaggio.me makes it easy. Use our app to select the perfect cheeses
                        for your gathering, and then get expert advice on pairing them with wines, crackers, and other
                        accompaniments. Our chatbot is always available to help you plan the perfect cheese platter.
                    </p>

                    <p className="text-gray-600 mb-6">
                        Formaggio.me is your one-stop-shop for all things cheese. With our app, you'll never be stuck wondering
                        what that delicious cheese is or how to pair it with other foods. Whether you're a cheese aficionado or just
                        starting to explore the world of cheese, Formaggio.me is the perfect companion for your culinary journey.
                    </p>

                    <div className="mt-8">
                        <h4 className="text-xl text-gray-800 mb-4">Key Features:</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Visual cheese identification using AI-powered technology
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Interactive chatbot for asking questions about cheese
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                In-depth information on cheese origin, production process, nutritional information, and history
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Expert advice on pairing cheese with wines, crackers, and other accompaniments
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                Perfect for cheese enthusiasts, party planners, and anyone looking to explore the world of cheese
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="relative h-64 sm:h-80 lg:h-[500px] rounded-lg overflow-hidden order-first lg:order-last">
                    <Image
                        src="/assets/cheese-platter.png"
                        alt="Cheese platter with various types of cheese"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 400px"
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
