import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Contacts from './components/Contacts';
import AboutCompany from './components/AboutCompany';
import PressCenter from './components/PressCenter';
import News from './components/News';
import NewsArticle from './components/NewsArticle';
import Vacancies from './components/Vacancies';
import Auth from './components/Auth';
import Catalog from './components/Catalog';
import CartPage from './components/CartPage';
import CartFlash from './components/CartFlash';
import Profile from './components/Profile';
import ProductPage from './components/ProductPage';
import AdminHome from './components/AdminHome';
import ManagerHome from './components/ManagerHome';


const container = document.getElementById('app');
if (container) {
    const page = container.dataset.page || 'home';
    const products = window.catalogProducts || [];
    const product = window.productData || null;
    const newsId = window.newsId || null;
    const isAdminPage = page === 'admin-home' || page === 'manager-home';

    const root = createRoot(container);
    root.render(
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto] overflow-x-hidden">
            <Header adminMode={isAdminPage} overlapHero={page === 'home'} />
            <main className="min-h-0 min-w-0">
                {page !== 'home' && page !== 'contacts' && page !== 'about-company' && page !== 'press-center' && page !== 'press-news' && page !== 'press-news-article' && page !== 'vacancies' && page !== 'catalog' && page !== 'product' && page !== 'auth' && page !== 'cart' && page !== 'profile' && page !== 'admin-home' && page !== 'manager-home' && (
                    <div className="page-container my-12 flex w-full justify-center text-center min-[426px]:my-16 lg:my-[14vh]">
                        <div className="max-w-[980px]">
                            <p className="text-[28px] font-bold uppercase leading-[1.1] text-[#FA4234] drop-shadow-[0_2px_6px_rgba(250,66,52,0.18)] min-[426px]:text-[40px] lg:text-[52px]">
                                Данная страница находится в разработке
                            </p>
                            <p className="mt-4 text-[16px] text-[#666] min-[426px]:text-[20px]">
                                Скоро здесь появится новый контент
                            </p>
                        </div>
                    </div>
                )}

                {page === 'home' ? (
                    <Home />
                ) : page === 'contacts' ? (
                    <Contacts />
                ) : page === 'about-company' ? (
                    <AboutCompany />
                ) : page === 'press-center' ? (
                    <PressCenter />
                ) : page === 'press-news' ? (
                    <News />
                ) : page === 'press-news-article' ? (
                    <NewsArticle newsId={newsId} />
                ) : page === 'vacancies' ? (
                    <Vacancies />
                ) : page === 'catalog' ? (
                    <Catalog products={products} />
                ) : page === 'product' ? (
                    <ProductPage product={product} />
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


