import React from "react";
import { Link } from "react-router-dom";
import CardSlider from "./home/CardSlider";
import { useNewsItems } from "../hooks/useNews";

/** Продуктовые направления */
const PRODUCT_DIRECTION_CARDS = [
    {
        title: "Объектовая безопасность",
        description:
            "Охранные комплексы, СКУД, извещатели, запорные устройства, мобильный пункт досмотра и источники питания.",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
    {
        title: "Пожарная безопасность",
        description:
            "Роботизированные установки пожаротушения, лафетные стволы, вышки, «Страж» и системы СГТ.",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
    {
        title: "ОПУ и приводная техника",
        description: "Стационарные, мобильные и специальные ОПУ, актуаторы, АДЧР и медицинские приборы «АИП».",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
    {
        title: "Продукция специального назначения",
        description:
            "Несущие конструкции 19″, гидромеханизация, генератор «Вулкан-Б», глушители шума и многооборотная тара.",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
    {
        title: "НИОКР",
        description:
            "Научно-исследовательские и опытно-конструкторские работы: отдельные узлы и автоматизированные комплексы гражданского и военного назначения.",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
    {
        title: "Контрактное производство",
        description:
            "Покраска и порошковые покрытия, электроника и SMD-монтаж, металлообработка, лазерная, гидроабразивная и плазменная резка.",
        href: "/catalog",
        ctaLabel: "В каталог",
    },
];

const ADVANTAGES = [
    {
        title: "Опорно-поворотные устройства",
        text: "Разработка и производство ОПУ для антенных систем и задач позиционирования.",
    },
    {
        title: "Охрана периметра",
        text: "Трибоэлектрические, радиолучевые и сейсмические извещатели для протяжённых рубежей.",
    },
    {
        title: "Пожарные роботы",
        text: "Роботизированные системы для дистанционного тушения на объектах ТЭК и промышленности.",
    },
    {
        title: "Контрактное производство",
        text: "Металлообработка, электроника и покрытия по документации заказчика.",
    },
];

const MANUFACTURING = [
    {
        title: "Металлообработка",
        text: "Лазерная, гидроабразивная и плазменная резка, токарная обработка, сварка, гибка и другие операции.",
    },
    {
        title: "Электроника",
        text: "Изготовление печатных плат, SMD- и жгутовый монтаж, сборка и тестирование.",
    },
    {
        title: "Покрытия",
        text: "Окраска, порошковое покрытие и маркирование.",
    },
];

const COMPETENCE_LINKS = [
    { title: "Производственные возможности", href: "/about-company" },
    { title: "О компании", href: "/about-company" },
    { title: "Технические материалы", href: "/press-center" },
    { title: "Новости и проекты", href: "/press-center/news" },
];

function Home() {
    const { newsItems } = useNewsItems();
    const newsCards = newsItems.slice(0, 6).map(({ id, title, date }) => ({ id, title, date }));

    const newsFooter = (
        <Link
            to="/press-center/news"
            className="btnw-fill mx-auto flex h-[56px] w-full max-w-[300px] items-center justify-center p-4 uppercase tracking-widest max-[768px]:mx-auto min-[426px]:h-[68px]"
        >
            Все материалы
        </Link>
    );

    return (
        <div className="overflow-x-hidden text-[#181818]">
            <section className="relative bg-[#FA4234] pt-[88px] pb-12 min-[769px]:pt-[200px] min-[769px]:pb-16 lg:min-h-[794px] lg:pb-0">
                <div className="page-container flex min-h-[320px] flex-col justify-center gap-8 max-[768px]:items-center max-[768px]:text-center min-[426px]:min-h-[420px] lg:min-h-[inherit] lg:items-start lg:justify-center">
                    <h1 className="max-w-[900px] text-[28px] font-bold uppercase leading-[1.12] text-white min-[426px]:text-[40px] lg:text-[52px] lg:leading-[1.08]">
                        Разработка и производство инженерной продукции для безопасности и промышленности
                    </h1>
                    <p className="max-w-[820px] text-[16px] leading-relaxed text-white/90 min-[426px]:text-[18px] lg:text-[20px]">
                        НПП «ИНПРОКОМ» разрабатывает и производит оборудование специального назначения, решения для
                        объектовой и пожарной безопасности, ОПУ и приводную технику, а также выполняет контрактное
                        производство. Полный цикл — от НИОКР до серийного выпуска.
                    </p>
                    <div className="flex w-full flex-col gap-3 max-[768px]:max-w-[360px] min-[426px]:flex-row min-[426px]:gap-4">
                        <Link
                            to="/catalog"
                            className="btn-fill inline-flex h-[52px] min-w-[220px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                        >
                            <span className="relative z-10">Перейти в каталог</span>
                        </Link>
                        <Link
                            to="/contacts"
                            className="inline-flex h-[52px] min-w-[220px] items-center justify-center border-2 border-white/70 px-6 text-[14px] uppercase tracking-widest text-white transition hover:border-white hover:bg-white/10"
                        >
                            Обсудить задачу
                        </Link>
                    </div>
                </div>
            </section>

            <div className="bg-[#F2F2F2]">
                <section className="page-container grid min-h-0 gap-10 py-14 lg:grid-cols-[1fr_430px] lg:gap-14 lg:py-20">
                    <div>
                        <h2 className="section-title max-w-[840px]">
                            Научно-производственное предприятие полного цикла
                        </h2>
                        <p className="mt-5 max-w-[900px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-7 min-[426px]:text-[20px] lg:text-[22px]">
                            НПП «ИНПРОКОМ» — российский разработчик и производитель высокотехнологичного оборудования с
                            1992 года. Специализируемся на опорно-поворотных устройствах для антенн, технических
                            средствах охраны периметра и роботизированных системах пожаротушения. Работаем по
                            гособоронзаказу (ГОСТ РВ 0015-002).
                        </p>
                        <Link
                            to="/about-company"
                            className="btn-fill mt-8 inline-flex h-[52px] w-full max-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest min-[426px]:mt-12"
                        >
                            <span className="relative z-10">О компании</span>
                        </Link>
                    </div>

                    <div className="bg-[linear-gradient(150deg,#ff5244,#ea2e22)] p-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] min-[426px]:p-8 lg:ml-[4vh]">
                        {ADVANTAGES.map((item) => (
                            <div key={item.title} className="border-t border-white py-5 min-[426px]:py-6">
                                <p className="text-[18px] font-bold leading-snug min-[426px]:text-[20px]">{item.title}</p>
                                <p className="mt-2 text-[14px] leading-relaxed text-white/90 min-[426px]:text-[15px]">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="page-container py-14 lg:py-20">
                    <h2 className="section-title-lg">Продукция НПП «ИНПРОКОМ»</h2>
                    <div className="mt-8 w-full min-w-0 lg:mt-12">
                        <CardSlider
                            items={PRODUCT_DIRECTION_CARDS}
                            variant="activity"
                            footerLeft={
                                <Link
                                    to="/catalog"
                                    className="btn-fill inline-flex h-[52px] min-w-[220px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                                >
                                    <span className="relative z-10">Весь каталог</span>
                                </Link>
                            }
                        />
                    </div>
                </section>

                <section className="bg-[#ECECEC] py-14 lg:py-20">
                    <div className="page-container">
                        <h2 className="section-title-lg">Контрактное производство — от детали до готового изделия</h2>
                        <p className="mt-5 max-w-[920px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-7 min-[426px]:text-[20px]">
                            Выполняем производственные работы по документации заказчика и в составе комплексных
                            проектов: металлообработка, электроника и покрытия.
                        </p>
                        <div className="mt-10 grid gap-5 min-[426px]:mt-12 md:grid-cols-3">
                            {MANUFACTURING.map((item) => (
                                <article
                                    key={item.title}
                                    className="border border-[#E0E0E0] bg-white p-6 min-[426px]:p-8"
                                >
                                    <h3 className="text-[18px] font-bold uppercase text-[#FA4234] min-[426px]:text-[20px]">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-[15px] leading-relaxed text-[#4B4B4B]">{item.text}</p>
                                </article>
                            ))}
                        </div>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                to="/contacts"
                                className="btn-fill inline-flex h-[52px] min-w-[260px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                            >
                                <span className="relative z-10">Отправить ТЗ на расчёт</span>
                            </Link>
                            <Link
                                to="/about-company"
                                className="inline-flex h-[52px] min-w-[220px] items-center justify-center border-2 border-[#FA4234] px-6 text-[14px] uppercase tracking-widest text-[#FA4234] transition hover:bg-[#FA4234] hover:text-white"
                            >
                                О производстве
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="page-container grid items-start gap-10 py-14 lg:grid-cols-[1fr_560px] lg:gap-14 lg:py-20">
                    <div>
                        <h2 className="section-title-lg">Компетенции, подтверждённые производством и документацией</h2>
                        <p className="mt-5 max-w-[920px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-7 min-[426px]:text-[20px]">
                            Производственная база, лицензии и техническая документация — основа для проектов в
                            безопасности, промышленности и специальном машиностроении.
                        </p>
                    </div>
                    <img
                        src="/img/neliqued.png"
                        alt="Производственные компетенции НПП Инпроком"
                        loading="lazy"
                        decoding="async"
                        width={560}
                        height={380}
                        className="h-[240px] w-full object-cover shadow-[0_12px_30px_rgba(0,0,0,0.24)] min-[426px]:h-[320px] lg:h-[380px]"
                    />
                </section>

                <section className="bg-[#FA4234] py-14 lg:py-20">
                    <div className="page-container max-w-[1730px]">
                        <h2 className="section-title-lg text-white">Экспертные материалы и новости</h2>
                        <div className="mt-8 w-full min-w-0 lg:mt-12">
                            <CardSlider
                                items={newsCards}
                                variant="news"
                                footerLeft={newsFooter}
                                arrowTheme="light"
                                footerClassName="mt-8 flex flex-col-reverse items-center justify-center gap-6 max-[768px]:text-center min-[426px]:mt-10 min-[426px]:flex-row min-[426px]:items-center min-[426px]:justify-between"
                            />
                        </div>
                    </div>
                </section>

                <section className="page-container py-14 text-center lg:py-20">
                    <h2 className="section-title-lg mx-auto">Нужна консультация или расчёт проекта?</h2>
                    <p className="mx-auto mt-5 max-w-[820px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:text-[20px]">
                        Опишите задачу, укажите объект, требуемое оборудование или приложите техническое задание.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/contacts"
                            className="btn-fill inline-flex h-[52px] min-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest"
                        >
                            <span className="relative z-10">Запросить консультацию</span>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Home;
