import { useEffect } from 'react';

const SharePopup = ({ message }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            const popup = document.getElementById('share-popup');
            if (popup) {
                popup.classList.add('hidden');
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="share-popup" className="fixed bottom-4 left-4 p-2 bg-black text-white text-sm rounded-md shadow z-10 transition-opacity duration-300">
            {message}
        </div>
    );
};

export default SharePopup;