import React from "react";

const Footer = () =>{
    return(
        <footer className="w-full bg-[#F2F3F5] pb-5">
        <hr className="mb-4"/>
            <div className="mx-auto flex w-full max-w-[1220px] items-start justify-between px-6">
                <button><img src="/img/logo_footer.svg" alt="инпроком" className="h-[72px] w-auto" /></button>
                <div className="text-[18px] leading-7">
                    <p>Россия, г.Балакирево,<br />ул. Заводская, 10. </p>
                    <p className="mt-4">info@inprokom.ru</p>
                </div>
                <div className="text-[18px] leading-7">
                    <p>+7 49244 7 75 34</p>
                    <p className="mt-4">+7 49244 7 46 85</p>
                </div>
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="shape-fill scale-75 "
                    aria-label="Наверх"
                >
                    <svg width="32" height="20" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5864 11.7854C19.0312 11.5062 19.5278 11.3167 20.0463 11.2309C20.5509 11.2389 21.0356 11.4363 21.4006 11.7854L32.833 22.7889C34.4485 24.3067 36.9656 24.3167 38.5911 22.8089L38.6509 22.753C39.0404 22.3888 39.3512 21.9487 39.5641 21.4598C39.7771 20.9709 39.8877 20.4436 39.8892 19.9104C39.8907 19.3771 39.783 18.8492 39.5728 18.3591C39.3626 17.8691 39.0543 17.4272 38.6669 17.0608L21.4884 0.572416C21.0955 0.209121 20.5814 0.00506921 20.0463 0C19.4986 0.0877596 18.9734 0.282246 18.5006 0.572416L1.21839 17.0608C0.831488 17.4277 0.523795 17.87 0.314263 18.3604C0.10473 18.8508 -0.00220758 19.3788 3.45405e-05 19.9121C0.00227666 20.4453 0.113651 20.9725 0.3273 21.4611C0.540949 21.9496 0.852349 22.3893 1.24233 22.753L1.31413 22.8089C2.9516 24.3167 5.47463 24.3067 7.09814 22.7889L18.5864 11.7854Z" fill="#FA4234"/>
                    </svg>
                </button>
            </div>
            <div className="mx-auto mt-2 flex w-full max-w-[1220px] items-center justify-between px-6">
                <p className="text-[18px]">© НПП ИНПРОКОМ 2026</p>
                <button className="btn-fill h-[52px] w-[172px] text-[14px] mb-0 mr-2.5">
                    <span className="relative z-10">Обратная связь</span>
                </button>
            </div>
        </footer>

    )
}

export default Footer
