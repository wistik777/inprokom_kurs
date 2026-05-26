import React from "react";
import { getNewsUrl } from "../../data/newsItems";

function PressNewsCard({
    id,
    title,
    date,
    layout = "grid",
    highlight = false,
    invertHover = false,
    featured = false,
    className = "",
}) {
    const hoverNewsClass = highlight || invertHover ? "home-card--news" : "";
    const href = id ? getNewsUrl(id) : null;

    if (layout === "list") {
        const inner = (
            <article
                className={`press-news-card press-news-card--list home-card ${hoverNewsClass} flex h-full w-full flex-col gap-4 p-4 min-[426px]:flex-row min-[426px]:gap-6 min-[426px]:p-6`}
            >
                <div className="press-news-card__media h-[160px] w-full shrink-0 min-[426px]:h-[120px] min-[426px]:w-[200px]" />
                <div className="relative z-10 flex flex-1 flex-col justify-between">
                    <p className="text-[13px] uppercase tracking-wide text-white/70">{date}</p>
                    <h3 className="mt-3 text-[18px] leading-snug">{title}</h3>
                    <span className="mt-4 text-[13px] uppercase tracking-wide">Читать полностью →</span>
                </div>
            </article>
        );

        if (!href) {
            return <div className={className}>{inner}</div>;
        }

        return (
            <a href={href} className={`block h-full ${className}`}>
                {inner}
            </a>
        );
    }

    const minHeightClass = featured
        ? "min-h-[360px] min-[426px]:min-h-[420px] lg:min-h-[460px]"
        : layout === "grid"
          ? "min-h-[300px] min-[426px]:min-h-[340px]"
          : "";

    const inner = (
        <article
            className={`press-news-card home-card flex h-full ${minHeightClass} flex-col justify-between p-6 ${hoverNewsClass}`}
        >
            <p className="relative z-10 text-[13px] uppercase tracking-wide text-white/70">{date}</p>
            <div className="relative z-10 mt-auto pt-8">
                <h3 className="text-[18px] leading-snug md:text-[20px]">{title}</h3>
                <span className="mt-4 inline-block text-[13px] uppercase tracking-wide">Читать полностью →</span>
            </div>
        </article>
    );

    if (!href) {
        return <div className={className}>{inner}</div>;
    }

    return (
        <a href={href} className={`block h-full ${className}`}>
            {inner}
        </a>
    );
}

export default PressNewsCard;
