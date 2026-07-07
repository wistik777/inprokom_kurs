import React from "react";

const baseStats = [
    { value: "1992", label: "год основания компании" },
    { getValue: (years) => `${years}+`, label: "лет опыта в отрасли" },
    { value: "100%", label: "цикл: от разработки до выпуска" },
];

const mottoItems = [
    { title: "Качество", text: "Строгий контроль на каждом этапе производства и поставок." },
    { title: "Надежность", text: "Партнерство, подтвержденное репутацией и реестром ТПП РФ." },
    { title: "Социальная ответственность", text: "Развитие потенциала страны и создание рабочих мест." },
];

const activities = [
    "научные исследования и разработки в области технических наук",
    "разработка и производство технических средств охраны объектов",
    "разработка и производство медицинской аппаратуры",
    "разработка и производство установок подготовки и очистки воды для бытового потребления",
    "разработка и производство тепловых и аэрозольных установок",
    "разработка, производство и утилизация вооружений и военной техники",
    "производство противопожарного оборудования",
    "контрактное производство по документации заказчика в области приборостроения и механической обработки",
];

function AboutCompany() {
    const yearsOnMarket = new Date().getFullYear() - 1992;
    const stats = baseStats.map((item) => ({
        value: item.getValue ? item.getValue(yearsOnMarket) : item.value,
        label: item.label,
    }));

    return (
        <div>
            <section
                className="hero-under-header min-h-[360px] items-end bg-cover bg-center min-[426px]:min-h-[420px]"
                style={{ backgroundImage: "url('/img/cart_fon.png')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FA4234]/95 via-[#FA4234]/85 to-[#c92e22]/90" />
                <div className="relative z-10 page-container w-full pb-10 pt-4 min-[426px]:pb-14 min-[426px]:pt-8">
                    <p className="text-[12px] uppercase tracking-[0.2em] text-white/80 min-[426px]:text-[14px]">НПП Инпроком</p>
                    <h1 className="section-title mt-3 max-w-[800px] text-white">О компании</h1>
                    <p className="mt-5 max-w-[720px] text-[16px] leading-relaxed text-white/90 min-[426px]:text-[18px] lg:text-[20px]">
                        Научно-производственный комплекс, создающий высокотехнологичные решения для промышленности
                        и оборонного сектора
                    </p>

                    <div className="mt-8 grid gap-4 min-[426px]:mt-12 min-[426px]:gap-6 sm:grid-cols-3">
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className="border border-white/25 bg-white/10 px-6 py-5 backdrop-blur-sm"
                            >
                                <p className="text-[40px] font-bold leading-none text-white">{item.value}</p>
                                <p className="mt-2 text-[14px] uppercase tracking-wide text-white/85">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 text-[#181818] min-[426px]:py-16 lg:py-20">
                <div className="page-container grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <div>
                        <span className="inline-block bg-[#FA4234]/10 px-4 py-2 text-[13px] font-semibold uppercase tracking-widest text-[#FA4234]">
                            Кто мы
                        </span>
                        <p className="mt-6 text-[22px] font-bold uppercase leading-snug text-[#181818]">
                            ООО «НПП «Инпроком»
                        </p>
                        <p className="mt-2 text-[16px] leading-relaxed text-[#666]">
                            Научно-производственное предприятие «Инженерно-промышленная компания»
                        </p>

                        <div className="mt-8 space-y-5 text-[18px] leading-relaxed text-[#4B4B4B]">
                            <p>
                                Основано в <span className="font-bold text-[#FA4234]">1992 году</span>. Уже более{" "}
                                <span className="font-bold text-[#181818]">{yearsOnMarket} лет</span> предприятие
                                специализируется на разработке и производстве единичной и мелкосерийной продукции
                                машиностроения и приборостроения специального назначения.
                            </p>
                            <p>
                                Сегодня компания представляет собой научно-производственный комплекс с полным циклом
                                работ — от разработки до выпуска изделий. Мы решаем прикладные задачи: от отдельных
                                узлов и устройств до автоматизированных комплексов и изделий военного назначения.
                            </p>
                        </div>

                        <a
                            href="/catalog"
                            className="btn-fill mt-10 inline-flex h-[52px] min-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                        >
                            <span className="relative z-10">Смотреть каталог</span>
                        </a>
                    </div>

                    <div className="flex items-center justify-center bg-[#F5F5F5] p-10">
                        <div className="rounded-full border-[5px] border-[#FA4234] bg-white p-8 shadow-[0_20px_45px_rgba(250,66,52,0.2)] ring-8 ring-[#FA4234]/10">
                            <img
                                src="/img/unnamed.jpg"
                                alt="Логотип ООО НПП Инпроком"
                                className="h-[220px] w-[220px] max-w-full object-contain min-[426px]:h-[280px] min-[426px]:w-[280px] lg:h-[340px] lg:w-[340px]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#ECECEC] py-12 min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <h2 className="text-center text-[26px] font-bold uppercase text-[#181818] min-[426px]:text-[32px] lg:text-[36px]">Наша миссия</h2>
                    <div className="relative mx-auto mt-12 max-w-[1000px]">
                        <span className="absolute -left-2 -top-6 text-[80px] font-bold leading-none text-[#FA4234]/20">
                            «
                        </span>
                        <blockquote className="relative bg-white px-5 py-8 text-center text-[16px] leading-relaxed text-[#4B4B4B] shadow-[0_12px_40px_rgba(0,0,0,0.08)] min-[426px]:px-10 min-[426px]:py-12 min-[426px]:text-[18px] lg:text-[20px]">
                            Мы видим свою миссию в поддержке и развитии научно-технического потенциала государства,
                            предлагая высокотехнологичную продукцию и разработки, создаем рабочие места. Наш подход
                            основан на эффективных методах управления и производства. Наши цели — стабильная прибыль
                            в долгосрочной перспективе и рост конкурентных преимуществ выпускаемой продукции.
                        </blockquote>
                        <span className="absolute -bottom-10 -right-2 text-[80px] font-bold leading-none text-[#FA4234]/20">
                            »
                        </span>
                    </div>
                </div>
            </section>

            <section className="bg-[#FA4234] py-12 text-white min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <p className="text-center text-[16px] uppercase tracking-[0.25em] text-white/80">Наш девиз</p>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {mottoItems.map((item) => (
                            <article
                                key={item.title}
                                className="border border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                            >
                                <h3 className="text-[22px] font-bold uppercase">{item.title}</h3>
                                <p className="mt-4 text-[15px] leading-relaxed text-white/90">{item.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#2B2B2B] py-12 text-white min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <h2 className="max-w-[600px] text-[36px] font-bold uppercase leading-tight">
                            Основные виды деятельности
                        </h2>
                        <p className="text-[15px] uppercase tracking-widest text-white/50">
                            {activities.length} направлений
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-2">
                        {activities.map((item, index) => (
                            <article
                                key={item}
                                className="group flex gap-5 border border-white/10 bg-white/5 p-6 transition duration-300 hover:border-[#FA4234] hover:bg-white/10"
                            >
                                <span className="text-[32px] font-bold leading-none text-[#FA4234]/80 transition group-hover:text-[#FA4234]">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <p className="text-[16px] leading-relaxed text-white/90">{item}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white py-12 min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_320px]">
                        <div>
                            <h2 className="text-[36px] font-bold uppercase text-[#181818]">Надежность партнера</h2>
                            <p className="mt-6 text-[18px] leading-relaxed text-[#4B4B4B]">
                                Компания внесена в реестр российских предприятий и предпринимателей, финансовое и
                                экономическое положение которых свидетельствует о надежности как партнеров для
                                предпринимательской деятельности в России и за рубежом.
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center border-2 border-[#FA4234] bg-[#FA4234]/5 px-8 py-10 text-center">
                            <p className="text-[48px] font-bold text-[#FA4234]">ТПП РФ</p>
                            <p className="mt-4 text-[14px] font-semibold uppercase tracking-wide text-[#181818]">
                                Свидетельство
                            </p>
                            <p className="mt-2 text-[20px] font-bold text-[#FA4234]">№00057-171</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#ECECEC] py-12 min-[426px]:py-16 lg:py-20">
                <div className="page-container">
                    <h2 className="text-[36px] font-bold uppercase text-[#181818]">Как с нами связаться</h2>

                    <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
                        <div className="flex flex-col gap-5">
                            <div className="h-[360px] shrink-0 overflow-hidden bg-[#1a1a1a] shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                                <iframe
                                    title="Карта — НПП Инпроком"
                                    src="https://yandex.ru/map-widget/v1/?text=%D0%B1%D0%B0%D0%BB%D0%B0%D0%BA%D0%B8%D1%80%D0%B5%D0%B2%D0%BE%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%97%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%2010&z=16&l=map"
                                    className="h-full w-full border-0"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between border-l-4 border-[#FA4234] bg-white p-6 text-[#181818] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                                <div>
                                    <p className="text-[13px] font-semibold uppercase tracking-widest text-[#FA4234]">
                                        Производственная площадка
                                    </p>
                                    <p className="mt-4 text-[16px] leading-relaxed text-[#4B4B4B]">
                                        Связаться с нами можно любым удобным способом — по телефону, электронной
                                        почте или через форму обратной связи на сайте.
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4 border-t border-[#E8E8E8] pt-6">
                                    <p className="text-[15px] text-[#4B4B4B]">
                                        <span className="font-semibold text-[#181818]">Координаты:</span> N56°30.834´
                                        E38°50.842´
                                    </p>
                                    <p className="text-[15px] text-[#4B4B4B]">
                                        <span className="font-semibold text-[#181818]">График:</span> пн–пт, 8:00–17:00
                                    </p>
                                    <a
                                        href="https://yandex.ru/maps/?text=%D0%B1%D0%B0%D0%BB%D0%B0%D0%BA%D0%B8%D1%80%D0%B5%D0%B2%D0%BE%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%97%D0%B0%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D1%8F%2010"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-fill inline-flex h-[44px] w-full items-center justify-center bg-white text-[12px] uppercase tracking-widest"
                                    >
                                        <span className="relative z-10">Открыть в Яндекс.Картах</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            {[
                                {
                                    label: "Телефон",
                                    lines: ["+7 (49244) 77-53-4", "+7 (49244) 74-68-5"],
                                    hrefs: ["tel:+74924477534", "tel:+74924474685"],
                                },
                                {
                                    label: "Почта и сайт",
                                    lines: ["info@inprokom.ru", "www.inprokom.ru"],
                                    hrefs: ["mailto:info@inprokom.ru", "https://www.inprokom.ru"],
                                },
                                {
                                    label: "Адрес",
                                    lines: [
                                        "601630, Владимирская обл.",
                                        "пос. Балакирево, а/я 33",
                                        "ул. Заводская, 10, корп. 50",
                                    ],
                                    hrefs: [],
                                },
                            ].map((block) => (
                                <div key={block.label} className="bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                    <p className="text-[13px] font-semibold uppercase tracking-widest text-[#FA4234]">
                                        {block.label}
                                    </p>
                                    <div className="mt-3 space-y-1 text-[16px] text-[#4B4B4B]">
                                        {block.lines.map((line, i) =>
                                            block.hrefs[i] ? (
                                                <a
                                                    key={line}
                                                    href={block.hrefs[i]}
                                                    target={block.hrefs[i].startsWith("http") ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    className="block transition hover:text-[#FA4234]"
                                                >
                                                    {line}
                                                </a>
                                            ) : (
                                                <p key={line}>{line}</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="mt-auto flex flex-wrap gap-4 pt-2">
                                <a
                                    href="/contacts"
                                    className="btn-fill inline-flex h-[52px] min-w-[260px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                >
                                    <span className="relative z-10">Обратная связь</span>
                                </a>
                                <a
                                    href="/catalog"
                                    className="btn-fill inline-flex h-[52px] min-w-[220px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                >
                                    <span className="relative z-10">Каталог продукции</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default AboutCompany;
