import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getStaffLoginPath } from './api/client';
import ProtectedRoute from './components/ProtectedRoute';
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
import { markSkipSitePreloader } from './utils/skipPreloader';

function AppLayout({ children, showHeader = true, showFooter = true, headerProps = {} }) {
    return (
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto] overflow-x-hidden">
            {showHeader && <Header {...headerProps} />}
            <main className="min-h-0 min-w-0">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}

function NavigationPreloaderBridge() {
    const location = useLocation();
    const isFirstRender = React.useRef(true);

    React.useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        markSkipSitePreloader();
    }, [location.pathname]);

    return null;
}

function App() {
    const staffPath = getStaffLoginPath();

    return (
        <>
            <NavigationPreloaderBridge />
            <Routes>
                <Route
                    path="/"
                    element={
                        <AppLayout headerProps={{ overlapHero: true }}>
                            <Home />
                        </AppLayout>
                    }
                />
                <Route
                    path="/about-company"
                    element={
                        <AppLayout>
                            <AboutCompany />
                        </AppLayout>
                    }
                />
                <Route
                    path="/catalog"
                    element={
                        <AppLayout>
                            <Catalog />
                        </AppLayout>
                    }
                />
                <Route
                    path="/catalog/:productId"
                    element={
                        <AppLayout>
                            <ProductPage />
                        </AppLayout>
                    }
                />
                <Route
                    path="/press-center"
                    element={
                        <AppLayout>
                            <PressCenter />
                        </AppLayout>
                    }
                />
                <Route
                    path="/press-center/news"
                    element={
                        <AppLayout>
                            <News />
                        </AppLayout>
                    }
                />
                <Route
                    path="/press-center/news/:newsId"
                    element={
                        <AppLayout>
                            <NewsArticle />
                        </AppLayout>
                    }
                />
                <Route
                    path="/contacts"
                    element={
                        <AppLayout>
                            <Contacts />
                        </AppLayout>
                    }
                />
                <Route
                    path="/vacancies"
                    element={
                        <AppLayout>
                            <Vacancies />
                        </AppLayout>
                    }
                />
                <Route path={`/${staffPath}`} element={<StaffLogin />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AppLayout showFooter={false} headerProps={{ adminMode: true }}>
                                <AdminHome />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/statistics"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AppLayout showFooter={false} headerProps={{ adminMode: true }}>
                                <AdminSiteStats />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <ProtectedRoute requireManager>
                            <AppLayout showFooter={false} headerProps={{ adminMode: true }}>
                                <ManagerHome />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/inbox"
                    element={
                        <ProtectedRoute requireManager>
                            <AppLayout showFooter={false} headerProps={{ adminMode: true }}>
                                <ManagerInbox />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/content"
                    element={
                        <ProtectedRoute requireManager>
                            <AppLayout showFooter={false} headerProps={{ adminMode: true }}>
                                <ManagerContent />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/content/news/:newsId/preview"
                    element={
                        <ProtectedRoute requireManager>
                            <AppLayout showFooter={false} headerProps={{ managerPreviewMode: true }}>
                                <NewsArticle previewMode />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
