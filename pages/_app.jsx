// pages/_app.jsx
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react'
function MyApp({ Component, pageProps, session }) {
    return (
        <ThemeProvider>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider >
    );
};

export default MyApp;