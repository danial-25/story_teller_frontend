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
  const [currentPage, setCurrentPage] = useState(1);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkIsSmallScreen = () => {
    setIsSmallScreen(window.innerWidth < 640);
  };
  useEffect(() => {
    // Check the screen size on initial load
    checkIsSmallScreen();

    // Add an event listener to check the screen size when the window is resized
    window.addEventListener('resize', checkIsSmallScreen);

    // Remove the event listener on component unmount to avoid memory leaks
    return () => {
      window.removeEventListener('resize', checkIsSmallScreen);
    };
  }, []);
  // Set the number of stories to display per page
  const storiesPerPage = 8;

  // Calculate the total number of pages
  const totalPages = Math.ceil(story_title.length / storiesPerPage);

  // Function to update the current page number
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * storiesPerPage;
  const endIndex = Math.min(startIndex + storiesPerPage, story_title.length);

  // Slice the story_title array to get the stories for the current page

  const paginatedStories = story_title.slice(startIndex, endIndex);
  // console.log(totalPages);
  var visiblePages = 0;
  console.log(isSmallScreen);
  if (!isSmallScreen) {
    var visiblePages = Math.min(totalPages, 7);
  }
  else {
    var visiblePages = Math.min(totalPages, 5);
  }
  const halfVisiblePages = Math.floor(visiblePages / 2);
  let startPage = Math.max(1, currentPage - halfVisiblePages);
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);
  // console.log(endIndex);
  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  // Function to navigate to the last page
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };
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
      const response = await fetch(`https://story-backend-qu52.onrender.com/user/favorites?story_id=${story_id[index]}&email=${session.user.email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
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

  // console.log(visiblePages);
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
                {Array.from({ length: storiesPerPage }, (_, index) => {
                  // console.log(currentPage);
                  const realIndex = startIndex + index; // Calculate the actual index in the original array
                  const isFavorite = favoriteStories.includes(story_id[realIndex]);
                  // console.log(paginatedStories.length);
                  if (story_id[realIndex]) {
                    return (
                      <li key={story_id[realIndex]} className="bg-white p-4 shadow dark:bg-gray-800">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{story_title[realIndex]}</h3>

                          <div className="flex space-x-2">
                            <button
                              title={favoriteStories.includes(story_id[realIndex]) ? 'Remove from Favorites' : 'Add to Favorites'}
                              className="relative transition-colors duration-300 focus:outline-none"
                              onClick={() => handleAddToFavorites(realIndex)}
                            >
                              <svg
                                className={`w-6 h-6 ${favoriteStories.includes(story_id[realIndex]) ? 'text-yellow-500' : ''}`}
                                fill={`${favoriteStories.includes(story_id[realIndex]) ? 'currentColor' : 'none'}`}
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
                            <button className="flex items-center justify-center w-10 h-10" onClick={() => handleshare(story_title[realIndex], `https://story-teller-lilac.vercel.app/story/${story_id[realIndex]}`)}>
                              <i className="material-symbols-outlined">share</i>
                            </button>
                          </div>
                        </div>
                        <button
                          className="text-blue-500 hover:underline mt-2"
                          onClick={() => handleTitleClick(realIndex)}
                        >
                          {selectedStoryIndices.includes(realIndex) ? 'Hide' : 'Show More'}
                        </button>
                        {selectedStoryIndices.includes(realIndex) && (
                          <p className="text-gray-700 whitespace-pre-wrap dark:text-white">{story[realIndex]}</p>
                        )}
                        <audio className="mt-2" controls>
                          <source src={story_audio[realIndex]} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        {showSharePopup && <SharePopup message={`Link to ${sharedStoryUrl} copied to clipboard`} />}
                      </li>
                    );
                  }
                })}
              </ul>
            ) : (
              <p>No stories found.</p>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <button
                  className={`px-2 py-1 w-8 ${currentPage === 1 ? 'opacity-50' : ' rounded-md'
                    } mr-2 mt-2`}
                  disabled={currentPage === 1}
                  onClick={handleFirstPage}
                >
                  <i className="material-symbols-outlined">first_page</i> {/* Add h-6 class */}
                </button>
                <button
                  className={`px-2 py-1 w-8 ${currentPage === 1 ? 'opacity-50 ' : ' rounded-md'
                    } mr-2 mt-2`}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="material-symbols-outlined">chevron_left</i>
                </button>

                {/* Display page numbers */}
                <div className="flex">
                  {/* Show ellipsis if startPage is greater than 1 */}
                  {startPage > 1 && (
                    <span className="px-2 py-1 w-8 border border-transparent rounded-md">
                      ...
                    </span>
                  )}

                  {Array.from({ length: visiblePages }).map((_, index) => {
                    const pageNumber = startPage + index;
                    return (
                      pageNumber <= totalPages && (
                        <button
                          key={pageNumber}
                          className={`px-2 py-1 w-8 ${currentPage === pageNumber ? 'bg-gray-500 text-white' : ''}`}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </button>
                      )
                    );
                  })}

                  {/* Show ellipsis if endPage is less than totalPages */}
                  {endPage < totalPages && (
                    <span className="px-2 py-1 w-8 border border-transparent rounded-md">
                      ...
                    </span>
                  )}
                </div>

                <button
                  className={`px-2 py-1 w-8 ${currentPage === totalPages ? 'opacity-50' : ' rounded-md'
                    } ml-2 mt-2`}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="material-symbols-outlined">chevron_right</i>
                </button>
                <button
                  className={`px-2 py-1 w-8 ${currentPage === totalPages ? 'opacity-50' : ' rounded-md'
                    } ml-2 mt-2`}
                  disabled={currentPage === totalPages}
                  onClick={handleLastPage}
                >
                  <i className="material-symbols-outlined">last_page</i> {/* Add h-6 class */}
                </button>
              </div>
            )}
          </>
        )}
        {status === 'unauthenticated' && <p>Please sign in to view the content.</p>}
      </main>
    </Layout>
  );
}