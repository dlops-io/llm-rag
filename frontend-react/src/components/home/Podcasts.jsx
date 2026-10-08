
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PodcastCard from '../shared/PodcastCard';
import DataService from "../../services/DataService";

export default function Podcasts() {
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await DataService.GetPodcasts(4);
                setEpisodes(response.data);
            } catch (error) {
                console.error('Error fetching podcasts:', error);
                setEpisodes([]);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="py-16 md:py-20 px-4 md:px-6 max-w-7xl mx-auto bg-white" id="podcasts">
            <h2 className="text-3xl md:text-4xl text-center font-playfair text-gray-800 mb-4">
                Podcast
            </h2>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8 lg:gap-12">
                <div className="text-left">
                    <div className="flex justify-center lg:justify-start">
                        <Image
                            src="/assets/podcast.png"
                            alt="Podcast Icon"
                            width={240}
                            height={240}
                            className="w-48 h-48 md:w-60 md:h-60 lg:w-full lg:h-auto"
                        />
                    </div>
                    <h3 className="text-xl md:text-2xl text-gray-800 mt-6 mb-4 text-center lg:text-left">
                        About Podcasts
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-center lg:text-left">
                        Welcome to The Cheese Podcast, where we celebrate cheeses from around
                        the world in multiple languages! Each episode dives into the flavors,
                        textures, and stories behind different cheeses, bringing together
                        cultures and cuisines. Whether you're a cheese connoisseur or just curious,
                        join us as we explore the world of cheese, one language at a time!
                    </p>
                </div>

                <div className="grid gap-6">
                    {episodes.map((episode) => (
                        <PodcastCard key={episode.id} podcast={episode} />
                    ))}
                </div>
            </div>

            <div className="text-center mt-12">
                <Link
                    href="/podcasts"
                    className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white 
                             font-medium rounded transition-colors duration-200"
                >
                    View All Podcasts
                </Link>
            </div>
        </section>
    );
}