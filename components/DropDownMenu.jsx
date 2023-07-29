import { useState } from 'react';
import { useTheme } from 'next-themes'; // Import useTheme hook

const DropdownMenu = ({ onItemSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const { theme, setTheme } = useTheme(); // Access the theme and setTheme function from the useTheme hook

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setIsOpen(false);

        // Call the callback function with the selected item value
        onItemSelected(item);
    };

    return (
        <div className="relative " style={{ position: 'relative', zIndex: '9999' }}>
            <button
                onClick={toggleMenu}
                className={`flex items-center px-4 py-2 dark:text-white text-gray-700 bg-white  rounded-md focus:outline-none h-10 w-18 dark:bg-gray-800 `}
            >
                {selectedItem === '' && (
                    <i className="material-symbols-outlined">language</i>
                )}
                {selectedItem}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M6 8l4 4 4-4H6z" />
                </svg>
            </button>

            {isOpen && (
                <div
                    className='absolute right-0 mt-2 bg-white rounded-md shadow-lg dark:bg-gray-800'
                >
                    <ul className="py-2">
                        {[
                            'English',
                            'Russian',
                            'Spanish',
                            'French',
                            'German',
                            'Italian',
                            'Dutch',
                            'Portuguese',
                            'Japanese',
                            'Korean',
                            'Danish',
                            'Norwegian',
                            'Swedish',
                            'Polish',
                            'Turkish',
                            'Ukrainian',
                            'Greek',
                            'Finnish',
                            'Hungarian',
                            'Czech',
                            'Catalan',
                            'Croatian',
                            'Romanian',
                            'Slovak',
                            'Hindi',
                            'Thai',
                            'Indonesian',
                            'Vietnamese',
                            'Arabic',
                            'Hebrew',
                        ].map((item) => (
                            <li
                                key={item}
                                className='px-4 py-2  dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                onClick={() => handleItemClick(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
