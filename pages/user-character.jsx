import React, { useState, useEffect } from 'react';
import Layout from '@/layout';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Head from 'next/head';
export default function Character() {
    const [isLoading, setIsLoading] = useState(false); // Initialize to false
    const [character, setCharacter] = useState('');
    const { data: session, status } = useSession();
    const { resolvedTheme } = useTheme();
    const logoPath = resolvedTheme === 'dark'
        ? '/fairytale(3).ico'
        : resolvedTheme === 'system'
            ? '/fairytale(3).ico'
            : '/fairytale(1).png';
    useEffect(() => {
        // Check if session is defined and has the 'user' property
        if (session?.user?.email) {
            const sessionEmail = session.user.email;

            setIsLoading(true); // Set isLoading to true before the API call

            fetch(`https://story-backend-qu52.onrender.com/user/character?email=${sessionEmail}`)
                .then((response) => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error('Log in to view the content');
                        } else {
                            throw new Error('An error with the network has occurred');
                        }
                    }
                    return response.json();
                })
                .then((data) => {
                    // Assuming the API response has a 'character' property containing the story/description
                    if (data && data.character) {
                        setCharacter(data.character);
                    }
                    setIsLoading(false); // Set isLoading to false after API call is completed
                })
                .catch((error) => {
                    console.error('Error fetching character data:', error.message);
                    setIsLoading(false); // Set isLoading to false in case of error
                });
        } else {
            setIsLoading(false);
        }
    }, [session]); // Add 'session' as a dependency to re-run the effect whenever the session changes

    return (
        <Layout>
            <Head>
                <title>{session?.user?.name} - Story Teller</title>
                <link rel="icon" href={logoPath} />
            </Head>
            <main className="container mx-auto my-8">
                {status !== 'authenticated' ? (
                    <p>Log in to view the user info</p>
                ) : (
                    <>
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce2"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                        ) : (
                            <>
                                {character ? (
                                    // Display the character/story here
                                    <p>{character}</p>
                                ) : (
                                    <p>User has no favorites</p>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </Layout>
    );

}
