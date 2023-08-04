import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

function Header() {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({
      callbackUrl: `${window.location.origin}`,
    })
  };
  const handleGoogleSignIn = () => {
    signIn('google');
  };
  const [isuseroptions, setuseroptions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to determine if the screen size is small (less than 640 pixels width)
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('/');
  // Function to determine if the screen size is small (less than 640 pixels width)
  const checkIsSmallScreen = () => {
    setIsSmallScreen(window.innerWidth < 640);
  };
  const handleToggleOptions = () => {
    setuseroptions((prev) => !prev);
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
  useEffect(() => {
    setActiveTab(window.location.pathname);
  }, []);
  return (
    <header>
      <nav className="bg-white border border-gray-200 dark:border-transparent px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex justify-between items-center mx-auto max-w-screen-xl" style={{ position: 'relative', zIndex: '9999' }}>
          <a href="/home" className="flex items-center">
            <span className="text-xl font-semibold whitespace-nowrap dark:text-white">Story teller</span>
          </a>

          {/* For regular screens, display the navigation links and user info separately */}
          {!isSmallScreen && (
            <>
              <ul className={`hidden lg:flex mt-4 font-medium space-x-8 ${isSmallScreen ? 'lg:hidden' : ''}`}>
                {/* Navigation links */}
                <li>
                  <a href="/home" className={`${activeTab === '/home' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Home</a>
                </li>
                <li>
                  <a href="/random" className={`${activeTab === '/random' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Random</a>
                </li>
                <li>
                  <a href="/history" className={`${activeTab === '/history' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>History</a>
                </li>
                <li>
                  <a href="/favorites" className={`${activeTab === '/favorites' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Favorites</a>
                </li>
              </ul>

              {/* User info */}
              {session ? (
                <div className="flex items-center">
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-gray-800 dark:text-white font-medium">
                    <a href='/user-character'>{session.user.name}</a>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-1 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none dark:focus:ring-gray-800 ml-2"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="text-sm text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-1 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none dark:focus:ring-gray-800 ml-2"
                >
                  Log in
                </button>
              )}
            </>
          )}

          {/* For small screens, display user.image and burger menu in the same container */}
          {isSmallScreen && (
            <div className="flex items-center relative">
              {/* Display the user's logo as a button on small screens */}
              {session ? (
                <>
                  <button
                    onClick={handleToggleOptions}
                    className="w-8 h-8 rounded-full overflow-hidden focus:outline-none lg:hidden mr-2"
                  >
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {isuseroptions && (
                    <div className="absolute top-12 right-0 bg-white rounded-md shadow-lg dark:bg-gray-800">
                      <ul className="py-2">
                        <li className="px-4 py-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <a
                            href="/user-character"
                            className="text-gray-700 hover:text-primary-700 dark:text-white dark:hover:bg-gray-700"
                          >
                            {session.user.name}
                          </a>
                        </li>
                        <li
                          className="px-4 py-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={handleLogout}
                        >
                          Log out
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  className="text-sm text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-1 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none dark:focus:ring-gray-800 ml-2"
                >
                  Log in
                </button>
              )}

              {/* Display the burger menu icon */}
              <div className="lg:hidden">
                <button
                  type="button"
                  className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-1 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                >
                  ☰
                </button>
              </div>
            </div>
          )}


          {/* For larger screens, hide the burger menu icon */}
          {!isSmallScreen && (
            <div className="lg:hidden">
              <button
                type="button"
                className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-3 py-1 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              >
                ☰
              </button>
            </div>
          )}
        </div>

        {/* For smaller screens, display the navigation links in a horizontal layout */}
        <div className={`lg:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
          <ul className="flex justify-center items-center mt-4 font-medium space-x-8">
            <li>
              <a href="/home" className={`${activeTab === '/home' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Home</a>
            </li>
            <li>
              <a href="/random" className={`${activeTab === '/random' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Random</a>
            </li>
            <li>
              <a href="/history" className={`${activeTab === '/history' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>History</a>
            </li>
            <li>
              <a href="/favorites" className={`${activeTab === '/favorites' ? 'dark:text-white text-primary-700' : 'text-gray-700 hover:text-primary-700 dark:text-gray-400 dark:hover:text-white'}`}>Favorites</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );

}

export default Header;
