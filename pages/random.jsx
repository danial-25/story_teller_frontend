import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SharePopup from '@/SharePopup';
import DropdownMenu from '@/DropDownMenu';
import Layout from '@/layout';
import Head from 'next/head';
import { useTheme } from 'next-themes';

export default function random() {
    const { resolvedTheme } = useTheme();
    const logoPath = resolvedTheme === 'dark'
        ? '/fairytale(3).ico'
        : resolvedTheme === 'system'
            ? '/fairytale(3).ico'
            : '/fairytale(1).png';
    const [story, setStory] = useState('');
    const [audio, setAudio] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false); // New state for favorite status
    const [story_id, setStoryId] = useState('');
    const audioRef = useRef(null);
    const { data: session } = useSession();
    const [story_url, setUrl] = useState('');
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [language, setLanguage] = useState('');
    const languageMap = {
        English: 'en',
        Russian: 'ru',
        Spanish: 'es',
        French: 'fr',
        German: 'de',
        Italian: 'it',
        Dutch: 'nl',
        Portuguese: 'pt',
        Japanese: 'ja',
        Korean: 'ko',
        Danish: 'da',
        Norwegian: 'no',
        Swedish: 'sv',
        Polish: 'pl',
        Turkish: 'tr',
        Ukrainian: 'uk',
        Greek: 'el',
        Finnish: 'fi',
        Hungarian: 'hu',
        Czech: 'cs',
        Catalan: 'ca',
        Croatian: 'hr',
        Romanian: 'ro',
        Slovak: 'sk',
        Hindi: 'hi',
        Thai: 'th',
        Indonesian: 'id',
        Vietnamese: 'vi',
        Arabic: 'ar',
        Hebrew: 'he',
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [audio]);
    const handleRandom = async (e) => {
        try {
            setLoading(true);
            setError('');

            let selectedLanguage = languageMap[language];
            if (!selectedLanguage) {
                selectedLanguage = 'en'; // Default language if not found in the map
            }

            const url = `https://story-backend-qu52.onrender.com/story/random_story?email=${session?.user?.email}&language=${selectedLanguage}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('An error occurred. Please try again later.');
            }

            const responseData = await response.text();
            const data = responseData ? JSON.parse(responseData) : {};

            if (data.message) {
                setStory('');
                setAudio('');
                setStoryId('');
                setError('An error occurred. Please try again later.');
            } else if (response.status === 202) {
                setStory('');
                setAudio('');
                setStoryId('');
                setError('Issue generating topic. Please try again.');
            } else {
                const { story, audio, story_id } = data;
                setStory(story);
                setAudio(audio);
                setStoryId(story_id);
                setUrl(`https://story-teller-lilac.vercel.app//story/${story_id}`);
                console.log(story);
                setError('');
            }
        } catch (error) {
            console.error('Error:', error);
            setStory('');
            setAudio('');
            setStoryId('');
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    const handleToggleFavorite = async (story_id) => {
        setIsFavorite((prevFavorite) => !prevFavorite);
        if (isFavorite === false) {
            const response = await fetch('https://story-backend-qu52.onrender.com/user/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ story_id: story_id, email: session.user.email }),
            })
        }
        else {
            const response = await fetch(`https://story-backend-qu52.onrender.com/user/favorites?story_id=${story_id[index]}&email=${session.user.email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        }

    };
    const handleshare = (story_url) => {
        navigator.clipboard
            .writeText(story_url)
            .then(() => {
                setShowSharePopup(true);
            })
            .catch((error) => {
                console.error('Failed to copy link to clipboard:', error);
            });
    };
    const handleItemSelected = (item) => {
        // Send the selected item to the API or perform any other action
        console.log(`Selected item: ${item}`);
        setLanguage(item);
        // Send the value to the API or perform any other action here
    };
    return (
        <Layout>
            <Head>
                <title>Random - Story Teller</title>
                <link rel="icon" href={logoPath} />
            </Head>
            <div className="max-w-xs mx-auto">
                <h1 className="text-xl flex justify-center font-semibold mb-4">Generate a random story</h1>
                <div className="flex justify-center items-center mb-4"> {/* Add "items-center" class here */}
                    <button
                        onClick={handleRandom}
                        className="bg-gray-400 text-white px-4 py-2 rounded h-10"
                        title="Generate random story"
                    >
                        <i className="material-symbols-outlined">shuffle</i>
                    </button>
                    <DropdownMenu onItemSelected={handleItemSelected} />
                </div>
            </div>


            {loading ? (
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce2"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
            ) : (
                story && (
                    <div className="mt-4">
                        <div className="flex items-center">
                            <h3 className="text-xl font-semibold mb-2">Story:</h3>
                            {audio && (
                                <audio ref={audioRef} controls className="ml-4">
                                    <source src={audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                            {session && (
                                <button
                                    title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                    className="relative transition-colors duration-300 focus:outline-none"
                                    onClick={() => handleToggleFavorite(story_id)}
                                >
                                    <svg
                                        className={`w-6 h-6 ${isFavorite ? 'text-yellow-500' : ''}`}
                                        fill={`${isFavorite ? 'currentColor' : 'none'}`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="1.5"
                                            d="M12 2L9.15 8.57 2 9.27l5.18 4.73L5.82 22 12 17.5l6.18 4.5-1.35-7.01L22 9.27l-7.15-.7L12 2z"
                                        />
                                    </svg>
                                </button>
                            )}
                            <button class="flex items-center justify-center w-10 h-10 " onClick={() => {
                                setShowSharePopup(false);
                                handleshare(story_url)
                            }}>
                                <i class="material-symbols-outlined">share</i>
                            </button>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap dark:text-white">{story}</p>
                    </div>
                )
            )}
            {showSharePopup && <SharePopup message={`Link copied to clipboard`} />}
        </Layout>
    )
}