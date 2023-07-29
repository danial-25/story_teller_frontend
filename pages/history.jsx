import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import SharePopup from '@/SharePopup';

export default function Fav() {
  const { data: session, status } = useSession();
  const [story_title, setStoryTitle] = useState([]);
  const [story_audio, setStoryAudio] = useState([]);
  const [story, setStory] = useState([]);
  const [favoriteStories, setFavoriteStories] = useState([]);
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
      const response = await fetch('https://story-backend-qu52.onrender.com/user/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data) {
        setStoryTitle(data.title || []);
        setStoryAudio(data.audio || []);
        setStory(data.story || []);
        setIds(data.ids || []);
        setFavoriteStories(data.favoriteStories || []);
      } else {
        console.error('Invalid API response:', data);
      }
      setIsLoading(false); // Set isLoading to false when the data is fetched
    } catch (error) {
      console.error('Error fetching story vectors:', error);
      setIsLoading(false); // Set isLoading to false in case of an error
    }
  };

  const handleAddToFavorites = async (index) => {
    if (favoriteStories.includes(story_id[index])) {
      // Story is already in favorites, so remove it from the list
      setFavoriteStories(favoriteStories.filter((id) => id !== story_id[index]));
      const response = await fetch('https://story-backend-qu52.onrender.com/user/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story_id: story_id[index], email: session.user.email }),
      });
    } else {
      // Story is not in favorites, so add it to the list
      setFavoriteStories([...favoriteStories, story_id[index]]);
      const response = await fetch('https://story-backend-qu52.onrender.com/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story_id: story_id[index], email: session.user.email }),
      });
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

  // const handleshare = (index, story_url) => {
  //   navigator.clipboard
  //     .writeText(story_url)
  //     .then(() => {
  //       // alert('story url is copied to the clipboard');
  //       setSelectedShareIndex(index);
  //     })
  //     .catch((error) => {
  //       console.error('Failed to copy link to clipboard:', error);
  //     });
  // };


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
                  const isFavorite = favoriteStories.includes(story_id[index]);

                  return (
                    <li key={story_id[index]} className="bg-white p-4 shadow dark:bg-gray-800">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{title}</h3>

                        <div className="flex space-x-2">
                          <button
                            title={favoriteStories.includes(story_id[index]) ? 'Remove from Favorites' : 'Add to Favorites'}
                            className="relative transition-colors duration-300 focus:outline-none"
                            onClick={() => handleAddToFavorites(index)}
                          >
                            <svg
                              className={`w-6 h-6 ${favoriteStories.includes(story_id[index]) ? 'text-yellow-500' : ''}`}
                              fill={`${favoriteStories.includes(story_id[index]) ? 'currentColor' : 'none'}`}
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