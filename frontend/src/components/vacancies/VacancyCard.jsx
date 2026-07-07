import React from "react";

function VacancyCard({ vacancy, onDetails, onApply }) {
    return (
        <article className="vacancy-card group flex h-full flex-col bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(250,66,52,0.18)]">
            <div className="vacancy-card__media relative h-[220px] overflow-hidden">
                <img
                    src={vacancy.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    style={{ objectPosition: vacancy.imagePosition }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${vacancy.accent}`} />
                <span className="absolute left-5 top-5 bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#FA4234]">
                    Актуально
                </span>
                <p className="absolute bottom-5 left-5 right-5 text-[13px] uppercase tracking-wide text-white/80">
                    {vacancy.department}
                </p>
            </div>

            <div className="flex flex-1 flex-col p-6">
                <h3 className="text-[22px] font-bold uppercase leading-snug text-[#181818]">{vacancy.title}</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="vacancy-tag">{vacancy.experience}</span>
                    <span className="vacancy-tag">{vacancy.schedule}</span>
                    <span className="vacancy-tag">Балакирево</span>
                </div>

                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#4B4B4B]">{vacancy.short}</p>

                <ul className="mt-4 space-y-2 border-t border-[#ECECEC] pt-4 text-[14px] text-[#666]">
                    {vacancy.duties.slice(0, 2).map((item) => (
                        <li key={item} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FA4234]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => onDetails(vacancy)}
                        className="btn-fill inline-flex h-[44px] flex-1 min-w-[140px] items-center justify-center bg-white text-[12px] uppercase tracking-widest"
                    >
                        <span className="relative z-10">Подробнее</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onApply(vacancy)}
                        className="inline-flex h-[44px] flex-1 min-w-[140px] items-center justify-center border-2 border-[#181818] bg-[#181818] text-[12px] uppercase tracking-widest text-white transition hover:border-[#FA4234] hover:bg-[#FA4234]"
                    >
                        Откликнуться
                    </button>
                </div>
            </div>
        </article>
    );
}

export default VacancyCard;
