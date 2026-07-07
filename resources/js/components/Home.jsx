import React from "react";
import CardSlider from "./home/CardSlider";
import { newsItems } from "../data/newsItems";

function Home() {
    const activityCards = [
        {
            title: "Объектовая безопасность",
            description: "Интегрированные комплексы физической, инженерной и информационной защиты объектов.",
        },
        {
            title: "Поворотно-поворотные устройства и приборы",
            description: "Специсполнения механизмов и приводов для сложных условий эксплуатации.",
        },
        {
            title: "Военная техника",
            description: "Электронные системы, специализированные узлы и компоненты.",
        },
        {
            title: "Промышленная автоматизация",
            description: "Решения для управления технологическими процессами и повышения эффективности производства.",
        },
        {
            title: "Системы связи и телемеханики",
            description: "Разработка и внедрение средств передачи данных для промышленных объектов.",
        },
        {
            title: "Специальное машиностроение",
            description: "Проектирование и изготовление уникальных машин и агрегатов под задачи заказчика.",
        },
        {
            title: "Робототехнические комплексы",
            description: "Автоматизированные системы для сложных операций на производстве и объектах.",
        },
        {
            title: "Информационная безопасность",
            description: "Комплексная защита инфраструктуры и критически важных данных предприятий.",
        },
        {
            title: "Наземные и морские системы",
            description: "Специализированное оборудование для эксплуатации в экстремальных условиях.",
        },
    ];

    const newsCards = newsItems.map(({ id, title, date }) => ({ id, title, date }));

    const activityFooter = (
        <div className="flex w-full flex-col items-center gap-3 max-[768px]:mx-auto max-[768px]:max-w-[360px] min-[426px]:flex-row min-[426px]:gap-4 min-[426px]:max-w-none">
            <a href="/catalog" className="btn-fill flex h-[48px] w-full items-center justify-center bg-white text-[13px] uppercase tracking-widest min-[426px]:h-[52px] min-[426px]:w-[190px] min-[426px]:text-[14px]">
                <span className="relative z-10">Каталог</span>
            </a>
            <a href="/press-center/news" className="btn-fill flex h-[48px] w-full items-center justify-center bg-white text-[13px] uppercase tracking-widest min-[426px]:h-[52px] min-[426px]:min-w-[280px] min-[426px]:text-[14px]">
                <span className="relative z-10">Перейти ко всем статьям</span>
            </a>
        </div>
    );

    const newsFooter = (
        <a href="/press-center/news" className="btnw-fill mx-auto flex h-[56px] w-full max-w-[300px] items-center justify-center p-4 uppercase tracking-widest max-[768px]:mx-auto min-[426px]:h-[68px]">
            Все новости компании
        </a>
    );

    return (
        <div className="overflow-x-hidden text-[#181818]">
            <section className="relative bg-[#FA4234] pt-[88px] pb-12 min-[769px]:pt-[200px] min-[769px]:pb-16 lg:min-h-[794px] lg:pb-0">
                <div className="page-container flex min-h-[320px] items-center justify-center max-[768px]:text-center min-[426px]:min-h-[420px] lg:min-h-[inherit] lg:justify-start">
                    <h1 className="max-w-[740px] text-[32px] font-bold uppercase leading-[1.12] text-white max-[768px]:mx-auto min-[426px]:text-[48px] lg:text-[68px] lg:leading-[1.08]">
                        Из сердца России к индустриальному лидерству
                    </h1>
                </div>
            </section>

            <div className="bg-[#F2F2F2]">
            <section className="page-container grid min-h-0 gap-10 py-14 lg:grid-cols-[1fr_430px] lg:gap-14 lg:py-20">
                <div>
                    <h2 className="section-title max-w-[840px]">
                        ИНПРОКОМ - ведущий разработчик специальной машиностроительной и приборной продукции
                    </h2>
                    <p className="mt-5 max-w-[900px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-7 min-[426px]:text-[20px] lg:text-[23px]">
                        Опыт и экспертиза позволяют компании решать задачи, где требуются высокая
                        надежность, точность и полный контроль на каждом жизненном цикле системы.
                    </p>
                    <a href="/about-company" className="btn-fill mt-8 inline-flex h-[52px] w-full max-w-[240px] items-center justify-center bg-white text-[14px] uppercase tracking-widest min-[426px]:mt-12">
                        <span className="relative z-10">О компании</span>
                    </a>
                </div>

                <div className="bg-[linear-gradient(150deg,#ff5244,#ea2e22)] p-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] min-[426px]:p-8 lg:ml-[4vh]">
                    <div className="border-t border-white py-5 min-[426px]:py-6">
                        <div className="flex items-start gap-3">
                            <p className="text-[32px] font-bold leading-none min-[426px]:text-[40px]">13</p>
                            <div className="text-[16px] font-bold leading-tight min-[426px]:text-[18px]">
                                <span className="block">млн</span>
                                <span className="block">тонн</span>
                            </div>
                        </div>
                        <p className="mt-3 text-[20px] font-bold leading-snug min-[426px]:text-[26px]">Объем производства</p>
                    </div>
                    <div className="border-t border-white py-5 min-[426px]:py-6">
                        <div className="flex items-start gap-3">
                            <p className="text-[32px] font-bold leading-none min-[426px]:text-[40px]">11,8</p>
                            <div className="text-[16px] font-bold leading-tight min-[426px]:text-[18px]">
                                <span className="block">млн</span>
                                <span className="block">тонн</span>
                            </div>
                        </div>
                        <p className="mt-3 text-[20px] font-bold leading-snug min-[426px]:text-[26px]">Объем производства</p>
                    </div>
                    <div className="border-t border-white py-5 min-[426px]:py-6">
                        <p className="text-[32px] font-bold leading-none min-[426px]:text-[40px]">24 %</p>
                        <p className="mt-3 text-[20px] font-bold leading-snug min-[426px]:text-[26px]">
                            Доля ИНПРОКОМ
                            <br />
                            на рынке продукции
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#ECECEC] py-14 lg:py-20">
                <div className="page-container max-w-[1560px]">
                    <h2 className="section-title-lg">Сферы деятельности</h2>
                    <div className="mt-8 w-full min-w-0 lg:mt-12">
                        <CardSlider items={activityCards} variant="activity" footerLeft={activityFooter} />
                    </div>
                </div>
            </section>

            <section className="page-container grid items-center gap-10 py-14 lg:grid-cols-[1fr_560px] lg:gap-14 lg:py-20">
                <div>
                    <h2 className="section-title-lg">Неликвиды и остатки складов</h2>
                    <p className="mt-5 max-w-[920px] text-[16px] leading-relaxed text-[#4B4B4B] min-[426px]:mt-7 min-[426px]:text-[20px] lg:text-[23px]">
                        НПП Инпроком реализует неликвидные складские остатки и излишки с высоким
                        качеством и прозрачными условиями поставок для предприятий.
                    </p>
                    <a href="/catalog" className="btn-fill mt-8 inline-flex h-[56px] w-full max-w-[360px] items-center justify-center bg-white text-[13px] uppercase tracking-widest min-[426px]:mt-12 min-[426px]:text-[14px]">
                        <span className="relative z-10">Подробный каталог складов</span>
                    </a>
                </div>
                <img
                    src="/img/neliqued.png"
                    alt="Неликвиды и остатки складов"
                    className="h-[240px] w-full object-cover shadow-[0_12px_30px_rgba(0,0,0,0.24)] min-[426px]:h-[320px] lg:h-[380px]"
                />
            </section>

            <section className="bg-[#FA4234] py-14 lg:py-20">
                <div className="page-container max-w-[1730px]">
                    <h2 className="section-title-lg text-white">Последние новости</h2>
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
            </div>
        </div>
    );
}

export default Home;
