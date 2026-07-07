import './bootstrap';
import '../css/app.css';

import { installSkipPreloaderOnFormSubmit, installSkipPreloaderOnInternalNavigation } from './utils/skipPreloader';

installSkipPreloaderOnFormSubmit();
installSkipPreloaderOnInternalNavigation();

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
import StaffLogin from './components/StaffLogin';
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import AdminHome from './components/AdminHome';
import AdminSiteStats from './components/AdminSiteStats';
import ManagerHome from './components/ManagerHome';
import ManagerInbox from './components/ManagerInbox';
import ManagerContent from './components/ManagerContent';
import { initSitePreloader } from './utils/sitePreloader';


const container = document.getElementById('app');
if (container) {
    const page = container.dataset.page || 'home';
    const products = window.catalogProducts || [];
    const product = window.productData || null;
    const newsId = window.newsId || null;
    const isStaffLoginPage = page === 'staff-login';
    const isAdminPage = page === 'admin-home' || page === 'admin-statistics' || page === 'manager-home' || page === 'manager-inbox' || page === 'manager-content' || page === 'manager-news-preview';
    const isManagerPreview = page === 'manager-news-preview';

    const root = createRoot(container);
    root.render(
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto] overflow-x-hidden">
            {!isStaffLoginPage && (
                <Header adminMode={isAdminPage && !isManagerPreview} managerPreviewMode={isManagerPreview} overlapHero={page === 'home'} />
            )}
            <main className="min-h-0 min-w-0">
                {page !== 'home' && page !== 'contacts' && page !== 'about-company' && page !== 'press-center' && page !== 'press-news' && page !== 'press-news-article' && page !== 'vacancies' && page !== 'catalog' && page !== 'product' && page !== 'staff-login' && page !== 'admin-home' && page !== 'admin-statistics' && page !== 'manager-home' && page !== 'manager-inbox' && page !== 'manager-content' && page !== 'manager-news-preview' && (
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
                ) : page === 'staff-login' ? (
                    <StaffLogin />
                ) : page === 'admin-home' ? (
                    <AdminHome />
                ) : page === 'admin-statistics' ? (
                    <AdminSiteStats />
                ) : page === 'manager-home' ? (
                    <ManagerHome />
                ) : page === 'manager-inbox' ? (
                    <ManagerInbox />
                ) : page === 'manager-content' ? (
                    <ManagerContent />
                ) : page === 'manager-news-preview' ? (
                    <NewsArticle newsId={newsId} previewMode />
                ) : (
                    <div />
                )}
            </main>
            {!isAdminPage && !isStaffLoginPage && <Footer />}
        </div>

    );

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            initSitePreloader();
        });
    });
} else {
    initSitePreloader();
}

