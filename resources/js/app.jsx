import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import Auth from './components/Auth';
import Catalog from './components/Catalog';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import CartFlash from './components/CartFlash';


const container = document.getElementById('app');
if (container) {
    const page = container.dataset.page || 'auth';
    const products = window.catalogProducts || [];
    const product = window.productData || null;

    const root = createRoot(container);
    root.render(
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
            <Header />
            <main className="min-h-0">
                {page === 'catalog' ? (
                    <Catalog products={products} />
                ) : page === 'product' ? (
                    <ProductPage product={product} />
                ) : page === 'cart' ? (
                    <CartPage />
                ) : (
                    <Auth />
                )}
            </main>
            <Footer />
            <CartFlash />
        </div>

    );

}


