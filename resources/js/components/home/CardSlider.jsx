import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import { computeSliderMetrics } from "../../hooks/useSliderMetrics";

const SLIDER_TRANSITION = "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)";

function formatPage(current, total) {
    return `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function CardSlider({
    items,
    variant,
    footerLeft = null,
    arrowTheme = "dark",
    footerClassName = "mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-[#D7D7D7] pt-8",
}) {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) {
            return undefined;
        }

        const measure = () => {
            setContainerWidth(Math.floor(element.getBoundingClientRect().width));
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(element);
        window.addEventListener("resize", measure);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const effectiveWidth =
        containerWidth > 0
            ? containerWidth
            : typeof window !== "undefined"
              ? Math.min(window.innerWidth - 32, 1360)
              : 1360;

    const { cardWidth, cardHeight, perView, gap } = computeSliderMetrics(variant, effectiveWidth);
    const cardStep = cardWidth + gap;
    const pageStep = perView * cardStep;
    const maxOffset = Math.max(0, (items.length - perView) * cardStep);
    const totalPages = Math.max(1, Math.ceil(items.length / perView));
    const maxPage = totalPages - 1;

    const [page, setPage] = useState(0);
    const offset = Math.min(page * pageStep, maxOffset);

    useEffect(() => {
        setPage(0);
    }, [perView, cardWidth, containerWidth]);

    useEffect(() => {
        setPage((current) => Math.min(current, maxPage));
    }, [maxPage]);

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(maxPage, p + 1));

    const arrowClass =
        arrowTheme === "light" ? "home-slider-arrow home-slider-arrow--light" : "home-slider-arrow";

    return (
        <div ref={containerRef} className="home-slider w-full min-w-0">
            <div
                className="home-slider__viewport w-full overflow-hidden"
                style={{ minHeight: cardHeight > 0 ? `${cardHeight}px` : undefined }}
            >
                <div
                    className="flex will-change-transform"
                    style={{
                        gap: `${gap}px`,
                        transform: `translate3d(-${offset}px, 0, 0)`,
                        transition: SLIDER_TRANSITION,
                    }}
                >
                    {items.map((card, index) => (
                        <Card
                            key={`${card.title}-${index}`}
                            variant={variant}
                            width={cardWidth}
                            height={cardHeight}
                            {...card}
                        />
                    ))}
                </div>
            </div>

            <div className={`${footerClassName} w-full`}>
                {footerLeft && <div className="w-full max-[425px]:w-full min-[426px]:w-auto">{footerLeft}</div>}
                <div className="ml-auto flex shrink-0 items-center gap-4 text-[16px] min-[426px]:gap-5 min-[426px]:text-[18px]">
                    <span className={arrowTheme === "light" ? "text-white" : "text-[#707070]"}>
                        {formatPage(page + 1, totalPages)}
                    </span>
                    <button
                        type="button"
                        aria-label="Назад"
                        className={arrowClass}
                        onClick={goPrev}
                        disabled={page === 0}
                    >
                        <span className="relative z-10 text-[22px] leading-none">‹</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Вперед"
                        className={arrowClass}
                        onClick={goNext}
                        disabled={page >= maxPage}
                    >
                        <span className="relative z-10 text-[22px] leading-none">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CardSlider;
