// pages/index.js
import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
const LandingPage = () => {
    const router = useRouter();
    const { data: session, loading } = useSession({ redirectTo: false });
    useEffect(() => {
        sendEmptyRequestToBackend();
    }, []);

    const sendEmptyRequestToBackend = () => {
        // Make a POST request to the backend using the fetch() function
        fetch('https://story-backend-qu52.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // You can leave the body empty if you just need to send an empty request
        });
    }
    const handleredirect = async (page) => {
        try {
            if (!session) {
                await signIn('google', {
                    callbackUrl: `${window.location.origin}/${page}`,
                })
            }
            router.push(page); // Redirect after successful sign-in // Redirect after successful sign-in
        } catch (error) {
            // Handle any error that occurs during sign-in
            console.error('Error during sign-in:', error);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-800 transition-all duration-500">
            <Head>
                <title>Story Teller</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* Landing page content */}
            <main className="flex flex-col items-center mt-12">
                <h2 className="text-4xl text-center font-bold mb-4">Story Teller - Stories of your interest</h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-md px-4 text-center">
                    Experience the magic of AI-powered short stories with Story Teller. Generate captivating tales on any topic, with Text-to-Speech support for 30 languages.
                </p>

                <button className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg shadow-md " onClick={() => handleredirect('/home')}>
                    Start Story Generation
                </button>




                <div className="w-full p-4">
                    <h3 className="text-3xl font-bold mb-8 text-center">Explore Our features:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {/* Wrap each div's content in a clickable element */}
                        <div
                            className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:-translate-y-2 transition-transform"
                            onClick={() => handleredirect('/home')}
                        >
                            <h4 className="text-2xl font-bold mb-4 text-center">Topic-Driven Story Creation</h4>
                            <p className="text-lg text-center text-gray-800 dark:text-white">
                                Enter any topic in 30 languages, and witness the magic! Experience instant story generation using vector databases for similar stories. Enjoy text and audio narratives that take seconds to 1.5 minutes to create. With this feature, you can effortlessly unleash your creativity and indulge in topic-driven storytelling that's as diverse as it is captivating.
                            </p>
                        </div>

                        <div
                            className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:-translate-y-2 transition-transform"
                            onClick={() => handleredirect('/random')}
                        >
                            <h4 className="text-2xl font-bold mb-4 text-center">Random Stories</h4>
                            <p className="text-lg text-center text-gray-800 dark:text-white">
                                Discover our special feature for the curious minds and the seekers of spontaneity - Random Stories! If you're unsure about the topic or simply feeling a bit lazy, worry not! With just a language selection, you'll be instantly delighted with a captivating story in your chosen language. Embrace the element of surprise and let randomness lead you to exciting narratives!
                            </p>
                        </div>

                        <div
                            className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:-translate-y-2 transition-transform"
                            onClick={() => handleredirect('/user-character')}
                        >
                            <h4 className="text-2xl font-bold mb-4 text-center">Analysis of User's Character</h4>
                            <p className="text-lg text-center text-gray-800 dark:text-white">
                                Explore the captivating world of character analysis within our project! By simply clicking on your username, discover intricate insights into your character. These analyses are intelligently crafted based on the stories you've thoughtfully added to your Favorites. Unravel the depths of your persona and embark on a self-discovery adventure like never before!
                            </p>
                        </div>
                    </div>
                </div>


                {/* Contact Us section */}
                {/* <div className="w-full p-4 mt-12">
                    <h3 className="text-3xl font-bold mb-8 text-center">Contact Us</h3>
                    <form className="max-w-md mx-auto">
                        <div className="mb-4">
                            <label className="block mb-2">Name</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input type="email" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Message</label>
                            <textarea className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600">Submit</button>
                    </form>
                </div> */}
            </main >

            <footer className=" py-4 px-8 mt-auto w-full">
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">&copy; 2023 Story Teller. All rights reserved.</p>
            </footer>
        </div >
    );
};

export default LandingPage;
