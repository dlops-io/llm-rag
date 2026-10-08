import Link from 'next/link';

export default function About() {
    return (
        <section className="py-16 md:py-20 px-4 md:px-6 max-w-4xl mx-auto" id="about">
            <h1 className="text-3xl md:text-4xl text-center font-playfair text-gray-800 mb-4">
                About Us
            </h1>
            <div className="w-24 h-px bg-gray-300 mx-auto mb-10"></div>

            <div className="prose prose-gray mx-auto text-center">
                <p className="mb-6">
                    Welcome to <strong>Formaggio.me</strong>, a web application born out of a passion for both cheese and cutting-edge
                    technology. This site was created as part of a demonstration project for developing applications using large
                    language models (AI). My name is Pavlos Protopapas, and I am the instructor of <strong>AC215</strong>, a course offered at
                    <strong> Harvard University</strong>. You can find more details about the course{' '}
                    <Link
                        href="http://harvard-iacs.github.io/2024-AC215/"
                        className="text-gray-600 hover:text-gray-800 underline transition-colors"
                    >
                        here
                    </Link> and learn more about me and my research{' '}
                    <Link
                        href="https://www.stellardnn.org/"
                        className="text-gray-600 hover:text-gray-800 underline transition-colors"
                    >
                        here
                    </Link>.
                </p>

                <p className="mb-6">
                    If you're interested in taking the course as a Harvard student you can find it in the my.harvard
                    catalog, it is also available through <strong>Harvard's Division of Continuing Education (DCE)</strong> for everyone else,
                    with the next offering scheduled for <strong>Spring 2025</strong>.
                </p>

                <p className="mb-6">
                    The course is designed to provide structured experiential learning, where I, the instructor, build the{' '}
                    <strong>AI Cheese Web App</strong> step by step during the semester. This hands-on approach helps students understand
                    both the technical and creative aspects of AI application development.
                </p>

                <p className="mb-6">
                    Please note that this is a demonstration project, so some features may be incomplete or still under
                    development. However, we hope you enjoy exploring it and would love to hear your thoughts! Feel free to
                    send us an email with comments.
                </p>

                <p className="mb-8">
                    Thank you for visiting <strong>Formaggio.me</strong>, and we hope you have fun exploring the intersection of cheese and
                    AI!
                </p>

                <Link
                    href="mailto:pavlos@seas.harvard.edu?subject=Feedback%20from%20Formaggio.me"
                    className="inline-block px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white 
                             font-medium rounded tracking-wide uppercase text-sm transition-colors duration-200"
                >
                    Contact Us
                </Link>
            </div>
        </section>
    );
}