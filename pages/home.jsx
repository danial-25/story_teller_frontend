import Layout from '../components/layout';
import MyForm from '@/input';
import React, { useEffect } from 'react';
function Home() {
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
    return (
        <Layout>
            <MyForm />
        </Layout>
    );
};

export default Home;