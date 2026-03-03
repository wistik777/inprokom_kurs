import React from 'react';
import { addToCart } from '../utils/cart';

const formatPrice = (value) => {
    return `${Number(value).toFixed(2)}р`;
};

const Card = ({ product }) => {
    const openProductPage = () => {
        window.location.assign(`/catalog/${product.id}`);
    };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={openProductPage}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openProductPage();
                }
            }}
            className="group relative w-full max-w-[230px] cursor-pointer overflow-hidden border border-[#FA4234] bg-white p-3.5 min-h-[275px]"
        >
            <div className="absolute inset-0 w-0 bg-[#FA4234] transition-all duration-500 ease-out group-hover:w-full" />

            <div className="relative z-10 h-full">
                <div className="flex h-full flex-col items-center text-center transition-all duration-500 ease-out group-hover:opacity-0">
                    <div className="h-[126px] w-full">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-contain"
                        />
                    </div>
                    <h3 className="mt-3 text-[16px] font-medium leading-5">
                        {product.name}
                    </h3>
                    <p className="mt-1.5 text-[12px] text-[#555]">
                        {product.model}
                    </p>
                    <p className="mt-2.5 text-[18px] font-semibold">
                        {formatPrice(product.price)}
                    </p>
                </div>

                <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center px-3 text-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100">
                    <h3 className="text-[18px] font-semibold leading-5 text-white">
                        {product.name}
                    </h3>
                    <p className="mt-2 text-[14px] text-white/90">
                        {product.model}
                    </p>
                    <p className="mt-3 max-h-[96px] overflow-hidden text-[13px] leading-5 text-white/95">
                        {product.description}
                    </p>
                    <div className="mt-5 flex flex-col gap-2.5">
                        <a
                            href={`/catalog/${product.id}`}
                            onClick={(event) => event.stopPropagation()}
                            className="cursor-pointer rounded-sm border border-white bg-white px-4 py-1.5 text-[11px] font-semibold text-[#FA4234] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
                        >
                            ПОДРОБНЕЕ
                        </a>
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                addToCart(product);
                            }}
                            className="cursor-pointer rounded-sm border border-white bg-transparent px-4 py-1.5 text-[11px] font-semibold text-white transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-white hover:text-[#FA4234]"
                        >
                            В КОРЗИНУ
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Card;
