import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Common/Navbar';

export default function RootLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}
