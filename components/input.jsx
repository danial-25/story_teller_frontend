import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import SharePopup from '@/SharePopup';
import DropdownMenu from './DropDownMenu';
const MyForm = () => {
    const [inputValue, setInputValue] = useState('');
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
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [audio]);

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');
            const url = `https://story-backend-qu52.onrender.com/story/get_story?topic=${inputValue}&email=${session?.user?.email}`;
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
                setError('');

            }

            setInputValue('');
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

    return (
        <div>
            <div className="max-w-xs mx-auto flex items-center justify-center">
                <label className="block mb-4">
                    Enter topic:
                    <div className="flex">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleChange}
                            className="border border-gray-300 px-4 py-2 w-52 h-10"
                        />
                        <div
                            className="bg-blue-500 text-white px-2 py-2 rounded ml-2 h-10 cursor-pointer"
                            onClick={handleSubmit}
                        >

                            Submit
                        </div>
                    </div>
                </label>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

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
        </div>
    );
};

export default MyForm;