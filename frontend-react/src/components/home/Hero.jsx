export default function Hero() {
    return (
        <section
            className="relative min-h-[100svh] flex items-center justify-center text-center bg-black"
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/hero_background.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="container mx-auto px-6 py-12 md:px-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-playfair text-white mb-4 md:mb-6">
                    🧀 Formaggio.me is here!
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white max-w-2xl mx-auto">
                    Discover the world of cheese through AI
                </p>
            </div>
        </section>
    );
}