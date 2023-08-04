import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Layout from '@/layout';
import SharePopup from '@/SharePopup';
import Head from 'next/head';
import { useTheme } from 'next-themes';
export default function StoryPage() {
    const { resolvedTheme } = useTheme();
    const logoPath = resolvedTheme === 'dark'
        ? '/fairytale(3).ico'
        : resolvedTheme === 'system'
            ? '/fairytale(3).ico'
            : '/fairytale(1).png';
    const router = useRouter();
    const { id } = router.query;
    const [story, setStory] = useState('');
    const [audio, setAudio] = useState('');
    const [error, setError] = useState('');
    const [storyId, setStoryId] = useState('');
    const audioRef = useRef(null);
    const [story_url, setUrl] = useState('');
    const [showSharePopup, setShowSharePopup] = useState(false);
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [audio]);

    useEffect(() => {
        if (id) {
            fetchStory(id);
        }
    }, [id]);

    const fetchStory = async (id) => {
        try {
            // Make an API request to retrieve the story vectors and metadata from your backend or database
            const response = await fetch(`https://story-backend-qu52.onrender.com/story/id/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data) {
                setStory(data.story);
                setAudio(data.audio);
                setStoryId(data.story_id);
                setUrl(`https://story-teller-lilac.vercel.app/story/${data.story_id}`);
                setError('');
            }
        } catch (error) {
            console.error('Error:', error);
            setStory('');
            setAudio('');
            setStoryId('');
            setUrl('');
            setError('An error occurred. Please try again later.');
        }
    };

    const handleshare = (story_url) => {
        navigator.clipboard
            .writeText(story_url)
            .then(() => {
                // console.log('Link copied to clipboard!');
                setShowSharePopup(true);
            })
            .catch((error) => {
                console.error('Failed to copy link to clipboard:', error);
            });
    };

    return (
        <Layout>
            <Head>
                <title>Story Teller</title>
                <link rel="icon" href={logoPath} />
            </Head>
            <div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {story && (
                    <div className="mt-4">
                        <div className="flex items-center">
                            <h3 className="text-xl font-semibold mb-2">Story:</h3>
                            {audio && (
                                <audio ref={audioRef} controls className="ml-4">
                                    <source src={audio} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                            <button class="flex items-center justify-center w-10 h-10 " onClick={() => handleshare(story_url)}>
                                <i class="material-symbols-outlined">share</i>
                            </button>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap dark:text-white">{story}</p>
                    </div>
                )}
                {showSharePopup && <SharePopup message={`Link copied to clipboard`} />}
            </div>
        </Layout>
    );
}