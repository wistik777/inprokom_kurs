import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Catalog from './components/Catalog';
import CartPage from './components/CartPage';
import CartFlash from './components/CartFlash';
import Profile from './components/Profile';
import AdminHome from './components/AdminHome';
import ManagerHome from './components/ManagerHome';


const container = document.getElementById('app');
if (container) {
    const page = container.dataset.page || 'auth';
    const products = window.catalogProducts || [];
    const isAdminPage = page === 'admin-home' || page === 'manager-home';

    const root = createRoot(container);
    root.render(
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
            <Header adminMode={isAdminPage} />
            <main className="min-h-0">
                {page !== 'catalog' && page !== 'auth' && page !== 'cart' && page !== 'profile' && page !== 'admin-home' && page !== 'manager-home' && (
                    <div className="mx-auto mt-[14vh] mb-[8vh] flex w-full max-w-[1250px] justify-center px-6 text-center">
                        <div className="max-w-[980px]">
                            <p className="text-[52px] font-bold uppercase tracking-wide leading-[1.1] text-[#FA4234] drop-shadow-[0_2px_6px_rgba(250,66,52,0.18)]">
                                Данная страница находится в разработке
                            </p>
                            <p className="mt-4 text-[20px] text-[#666]">
                                Скоро здесь появится новый контент
                            </p>
                        </div>
                    </div>
                )}

                {page === 'catalog' ? (
                    <Catalog products={products} />
                ) : page === 'auth' ? (
                    <Auth />
                ) : page === 'cart' ? (
                    <CartPage />
                ) : page === 'profile' ? (
                    <Profile />
                ) : page === 'admin-home' ? (
                    <AdminHome />
                ) : page === 'manager-home' ? (
                    <ManagerHome />
                ) : (
                    <div />
                )}
            </main>
            {!isAdminPage && <Footer />}
            {(page === 'catalog' || page === 'cart') && <CartFlash />}
        </div>

    );

}


