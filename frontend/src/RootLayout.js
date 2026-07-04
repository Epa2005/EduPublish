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
            <footer className="footer-modern">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <span className="footer-brand">{'\u{1F3EB}'} Upcoming TVT School</span>
                            <p>Upcoming TVT School Activity Publishing and Learning Management System. Connecting Upcoming TVT School, teachers, students, and the community of Bukomane through modern technology.</p>
                            <div className="footer-social">
                                <a href="#" title="Facebook">{'\u{1F4F1}'}</a>
                                <a href="#" title="Twitter">{'\u{1F426}'}</a>
                                <a href="#" title="LinkedIn">{'\u{1F4E1}'}</a>
                                <a href="#" title="YouTube">{'\u{1F3AC}'}</a>
                            </div>
                        </div>
                        <div className="footer-col">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/events">Events</a></li>
                                <li><a href="/notes">Study Notes</a></li>
                                <li><a href="/about">About</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="/notes">Learning Materials</a></li>
                                <li><a href="/events">School Calendar</a></li>
                                <li><a href="/contact">Contact Support</a></li>
                                <li><a href="/about">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Contact</h4>
                            <ul>
                                <li><a href="mailto:info@tvtschool.edu.rw">info@tvtschool.edu.rw</a></li>
                                <li><a href="tel:+250788888888">+250 788 888 888</a></li>
                                <li><a href="/contact">Send a Message</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        &copy; {new Date().getFullYear()} Upcoming TVT School. All rights reserved. Built with {'\u2764\uFE0F'} for Upcoming TVT School Community.
                    </div>
                </div>
            </footer>
        </>
    );
}
