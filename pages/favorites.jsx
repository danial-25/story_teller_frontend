import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import SharePopup from '@/SharePopup';
export default function Favorites() {
    const { data: session, status } = useSession();
    const [story_title, setStoryTitle] = useState([]);
    const [story_audio, setStoryAudio] = useState([]);
    const [story, setStory] = useState([]);
    const [story_id, setIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [sharedStoryUrl, setSharedStoryUrl] = useState('');
    const [timeoutId, setTimeoutId] = useState(null);
    useEffect(() => {
        if (status === 'authenticated') {
            // Fetch user story vectors based on the current session's email
            fetchStoryVectors(session.user.email);
        }
    }, [status]);

    const fetchStoryVectors = async (email) => {
        try {
            // Make an API request to retrieve the story vectors and metadata from your backend or database
            const response = await fetch(`https://story-backend-qu52.onrender.com/user/favorites?email=${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data) {
                setStoryTitle(data.title || []);
                setStoryAudio(data.audio || []);
                setStory(data.story || []);
                setIds(data.ids || []);
            } else {
                console.error('Invalid API response:', data);
            }
            setIsLoading(false); // Set isLoading to false when the data is fetched
        } catch (error) {
            console.error('Error fetching story vectors:', error);
            setIsLoading(false); // Set isLoading to false in case of an error
        }
    };

    const handleRemoveFromFavorites = async (index) => {
        console.log(index, story_id[index], story_title[index]);
        const storyIdToRemove = story_id[index];

        // setIds(story_id.filter((id) => id !== storyIdToRemove));

        try {
            const response = await fetch(`https://story-backend-qu52.onrender.com/user/favorites?story_id=${story_id[index]}&email=${session.user.email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (response.ok) {
                // Find the index of the storyIdToRemove in the story_id array

                //const removeIndex = story_id.indexOf(storyIdToRemove);

                // Create new arrays with the elements excluding the removeIndex
                const updatedStoryTitle = story_title.filter((_, i) => i !== index);
                const updatedStoryAudio = story_audio.filter((_, i) => i !== index);
                const updatedStory = story.filter((_, i) => i !== index);
                const updatedIds = story_id.filter((_, i) => i !== index);

                // Update the state with the new arrays
                setStoryTitle(updatedStoryTitle);
                setStoryAudio(updatedStoryAudio);
                setStory(updatedStory);
                setIds(updatedIds);
            } else {
                console.error('Failed to remove story from favorites');
            }
        } catch (error) {
            console.error('Error removing story from favorites:', error);
        }
    };

    const [selectedStoryIndices, setSelectedStoryIndices] = useState([]);

    const handleTitleClick = (index) => {
        if (selectedStoryIndices.includes(index)) {
            // Story is already selected, so remove it from the selected list
            setSelectedStoryIndices(selectedStoryIndices.filter((i) => i !== index));
        } else {
            // Story is not selected, so add it to the selected list
            setSelectedStoryIndices([...selectedStoryIndices, index]);
        }
    };

    const handleshare = (title, story_url) => {
        navigator.clipboard
            .writeText(story_url)
            .then(() => {
                clearTimeout(timeoutId);
                setShowSharePopup(true);
                setSharedStoryUrl(title);
                const newTimeoutId = setTimeout(() => {
                    setShowSharePopup(false);
                    setSharedStoryUrl('');
                }, 3000);
                setTimeoutId(newTimeoutId);
            })
            .catch((error) => {
                console.error('Failed to copy link to clipboard:', error);
            });
    };


    return (
        <Layout>
            <main className="container mx-auto my-8">
                {status === 'authenticated' && (
                    <>
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce2"></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            </div>
                        ) : story_title.length > 0 ? (
                            <ul className="space-y-4">
                                {story_title.map((title, index) => {
                                    const isFavorite = story_id.includes(story_id[index]);

                                    return (
                                        <li key={story_id[index]} className="relative bg-white p-4 shadow mb-4 dark:bg-gray-800">
                                            <div className="flex justify-between items-center">
                                                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                                                <div className="flex space-x-2">
                                                    <button
                                                        title="Remove from Favorites"
                                                        className="relative transition-colors duration-300 focus:outline-none "
                                                        onClick={() => handleRemoveFromFavorites(index)}
                                                    >
                                                        <svg
                                                            className="w-6 h-6 text-yellow-500 "
                                                            fill="currentColor"
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
                                                    <button className="flex items-center justify-center w-10 h-10" onClick={() => handleshare(title, `https://story-teller-lilac.vercel.app/story/${story_id[index]}`)}>
                                                        <i className="material-symbols-outlined">share</i>
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                className="text-blue-500 hover:underline mt-2"
                                                onClick={() => handleTitleClick(index)}
                                            >
                                                {selectedStoryIndices.includes(index) ? 'Hide' : 'Show More'}
                                            </button>
                                            {selectedStoryIndices.includes(index) && (
                                                <p className="text-gray-700 whitespace-pre-wrap dark:text-white">Story: {story[index]}</p>
                                            )}
                                            <audio className="mt-2" controls>
                                                <source src={story_audio[index]} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                            {showSharePopup && <SharePopup message={`Link to ${sharedStoryUrl} copied to clipboard`} />}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No stories found.</p>
                        )}
                    </>
                )}
                {status === 'unauthenticated' && <p>Please sign in to view the content.</p>}
            </main>
        </Layout>
    );
}