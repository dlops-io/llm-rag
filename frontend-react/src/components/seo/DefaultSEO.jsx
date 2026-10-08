import { DefaultSeo } from 'next-seo';

export default function DefaultSEO() {
    const seoConfig = {
        defaultTitle: 'Formaggio.me | AI-Powered Cheese Recognition & Information',
        titleTemplate: '%s | Formaggio.me',
        description: 'Discover the world of cheese with AI-powered recognition. Identify cheeses, get pairing suggestions, and learn about origins, production, and nutrition through our intelligent chatbot.',
        canonical: 'https://formaggio.me',
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url: 'https://formaggio.me',
            siteName: 'Formaggio.me',
            title: 'Formaggio.me - Your AI Cheese Companion',
            description: 'Explore cheese like never before with AI-powered recognition, expert pairing advice, and in-depth cheese knowledge.',
            images: [
                {
                    url: 'https://formaggio.me/assets/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Formaggio.me - AI Cheese Recognition App',
                },
            ],
        },
        twitter: {
            handle: '@formaggiome',
            site: '@formaggiome',
            cardType: 'summary_large_image',
        },
        additionalMetaTags: [
            {
                name: 'keywords',
                content: 'cheese identification, AI cheese recognition, cheese pairing, wine pairing, cheese platter, cheese guide, cheese origins, cheese varieties, artisanal cheese, cheese tasting, cheese education'
            },
            {
                name: 'application-name',
                content: 'Formaggio.me'
            },
            {
                name: 'apple-mobile-web-app-title',
                content: 'Formaggio.me'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1, maximum-scale=1'
            }
        ],
        additionalLinkTags: [
            {
                rel: 'icon',
                href: '/assets/favicon.ico'
            },
            {
                rel: 'apple-touch-icon',
                href: '/assets/apple-touch-icon.png',
                sizes: '180x180'
            }
        ]
    };

    return <DefaultSeo {...seoConfig} />;
}