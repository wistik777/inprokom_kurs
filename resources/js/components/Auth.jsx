import React, { useState } from "react";

const Auth = () =>{
    const [isLogin, setIsLogin] = useState(true)
    const errors = window.errors || {};
    return(
        <div className="flex justify-center mt-[2%] mb-[7%] relative ">
            <div className={`transition-all duration-500 ${isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'} flex`}>
                <form action="/login" method="POST" className="flex flex-col w-[433px] h-[680px] items-center shadow-[0_0_20px_rgba(0,0,0,0.30)]">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
                    <h1 className="text-[40px]  mt-[30%] font-medium">Войти</h1>
                    <div className="flex flex-col
                    [&_input]:w-[335px] [&_input]:h-[55px] [&_input]:border-solid [&_input]:border-[#FA4234] [&_input]:border-2 [&_input]:text-[20px] [&_input]:pl-[27px]
                    gap-8 ml-[42px] mr-[56px] mt-[5%]
                    [&_input:hover]:border-4 [&_input]:transition-all [&_input]:duration-30 [&_input]:ease-in-out">
                        <input type="text" className="" name="login" placeholder="Логин" required/>
                        {errors.login && <p className="text-red-500 text-sm">{errors.login[0]}</p>}
                        <input type="password" name="password" placeholder="Пароль" required/>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
                    </div>
                    <button type="submit" className="btn-fill w-[197.45px] h-[68.81px] text-[21px] mt-[61px]" >
                        <span className="relative z-10">ВОЙТИ</span>
                    </button>
                </form>
                <div className="bg-gradient-to-r from-[#FA4234] to-[#FF6842] w-[433px] h-[680px] flex flex-col items-center shadow-[-10px_0_20px_rgba(0,0,0,0.30)]">
                    <h1 className="text-[40px] text-white font-semibold mt-[218px] mr-[65px] ml-[64px]">Нет аккаунта?</h1>
                    <p className="text-[18px] text-white font-semibold text-center">нажмите на кнопку чтобы<br />зарегистрироваться</p>
                    <button className="btnw-fill w-[197.45px] h-[68.81px] text-[21px] mt-[83px] mb-[100px]" onClick={()=> setIsLogin(false)}>
                        <span className="relative z-10 ">ПЕРЕЙТИ</span>
                    </button>
                </div>
            </div>

            <div className={`transition-all duration-500 ${!isLogin ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'} flex`}>
                <div className="bg-gradient-to-r from-[#FA4234] to-[#FF6842] w-[433px] h-[680px] flex flex-col items-center shadow-[-10px_0_20px_rgba(0,0,0,0.30)]">
                    <h1 className="text-[40px] text-white font-semibold mt-[218px] ">Уже есть аккаунт?</h1>
                    <p className="text-[18px] text-white font-semibold text-center">нажмите на кнопку чтобы<br />войти</p>
                    <button className="btnw-fill w-[197.45px] h-[68.81px] text-[21px] mt-[83px] " onClick={()=> setIsLogin(true)}>
                        <span className="relative z-10 ">ПЕРЕЙТИ</span>
                    </button>
                </div>
                <form action="/reg" method="POST" className="flex flex-col w-[433px] h-[680px] items-center shadow-[0_0_20px_rgba(0,0,0,0.30)]">
                    <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
                    <h1 className="text-[40px] mt-[10%] font-medium">Регистрация</h1>
                    <div className="flex flex-col
                    [&_input]:w-[335px] [&_input]:h-[55px] [&_input]:border-solid [&_input]:border-[#FA4234] [&_input]:border-2 [&_input]:text-[20px] [&_input]:pl-[27px]
                    gap-8 ml-[42px] mr-[56px] mt-[10%]
                    [&_input:hover]:border-4 [&_input]:transition-all [&_input]:duration-30 [&_input]:ease-in-out">
                        <input type="text" className="" name="login" placeholder="Логин" required/>
                        {errors.login && <p className="text-red-500 text-sm">{errors.login[0]}</p>}

                        <input type="password" name="password" placeholder="Пароль" required/>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}

                        <input type="tel" name="phone" placeholder="Телефон" required/>
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone[0]}</p>}

                        <input type="email" name="email" placeholder="Почта" required/>
                        {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}

                    </div>
                    <div className="flex items-center mt-[6%] ml-[-10%]">
                        <input type="checkbox" name="rule" value="success" className="w-[20px] h-[20px] appearance-none border-2 border-[#FA4234]
                        checked:bg-[#FA4234] cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0
                        checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-[14px]
                        checked:after:font-bold
                        hover:border-3 transition-all duration-30 ease-in-out
                        "/>
                        <p className="text-[12px] ml-[8px]">Соглашаюсь с политикой конфиденциальности </p>
                    </div>


                    <button type="submit" className="btn-fill w-[240.45px] h-[68.81px] text-[18px] mt-[10%]" >
                        <span className="relative z-10">ЗАРЕГИСТРИРОВАТЬСЯ</span>
                    </button>
                </form>
            </div>
        </div>

    )
}

export default Auth;
