import React from "react";
import { Link } from "react-router-dom";
import { getNewsUrl } from "../../data/newsItems";

function Card({
    id,
    title,
    description,
    date,
    href,
    ctaLabel,
    variant = "activity",
    width,
    height,
}) {
    const isActivity = variant === "activity";
    const hasCustomSize = width > 0 && height > 0;
    const compact = hasCustomSize && width < 420;
    const newsHref = !isActivity && id ? getNewsUrl(id) : null;
    const activityHref = isActivity ? href || null : null;
    const targetHref = newsHref || activityHref;

    const sizeStyle = hasCustomSize
        ? { width, height, minWidth: width, flexShrink: 0 }
        : undefined;

    const sizeClass = hasCustomSize
        ? "p-5 min-[426px]:p-6"
        : isActivity
          ? "h-[559px] w-[474px] p-8"
          : "home-card--news h-[453px] w-[384.12px] p-6";

    const inner = (
        <article
            className={`home-card box-border shrink-0 flex flex-col justify-between overflow-hidden ${sizeClass} ${!isActivity ? "home-card--news" : ""}`}
            style={sizeStyle}
        >
            <div className="relative z-10">
                {!isActivity && (
                    <p className="text-[12px] uppercase tracking-wide min-[426px]:text-[14px]">Новости</p>
                )}
                <h3
                    className={
                        isActivity
                            ? `max-w-full font-bold uppercase leading-tight ${
                                  compact
                                      ? "text-[22px]"
                                      : "text-[24px] min-[426px]:text-[28px] lg:text-[30px]"
                              }`
                            : `mt-3 leading-snug min-[426px]:mt-4 ${
                                  compact ? "text-[17px]" : "text-[18px] min-[426px]:text-[20px]"
                              }`
                    }
                >
                    {title}
                </h3>
                {description && (
                    <p
                        className={`mt-4 max-w-full leading-relaxed text-white/90 min-[426px]:mt-6 ${
                            compact ? "text-[14px]" : "text-[15px] min-[426px]:text-[16px]"
                        }`}
                    >
                        {description}
                    </p>
                )}
            </div>

            <div className="relative z-10">
                {isActivity ? (
                    <span className="inline-block w-max border border-white/50 px-4 py-2 text-[12px] uppercase tracking-wide transition group-hover:bg-white group-hover:text-black min-[426px]:px-6 min-[426px]:py-3 min-[426px]:text-[14px]">
                        {ctaLabel || "Подробнее"}
                    </span>
                ) : (
                    <div className="flex items-center justify-between text-[12px] uppercase min-[426px]:text-[14px]">
                        <span>{date}</span>
                        <span>Читать</span>
                    </div>
                )}
            </div>
        </article>
    );

    if (targetHref) {
        return (
            <Link to={targetHref} className="group block h-full shrink-0" style={sizeStyle}>
                {inner}
            </Link>
        );
    }

    return inner;
}

export default Card;
