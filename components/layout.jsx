import Header from './header';

const Layout = ({ children }) => {
    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            <Header />
            <main className="mt-16 px-4 ">{children}</main>
            {/* Add footer or other layout elements */}
        </div>
    );
};

export default Layout;
