import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './app.css';
import { initSitePreloader } from './utils/sitePreloader';

const container = document.getElementById('app');

if (container) {
    createRoot(container).render(
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    );

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initSitePreloader();
        });
    });
}
