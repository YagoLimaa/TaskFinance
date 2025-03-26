"use client";

import { useUserContext } from '@/context/UserContext';
import React, { useState } from 'react';


function EsqueciSenhaForm(){
    const  { redefinirSenhaEmail } = useUserContext();

    const [email, setEmail] = useState("");

    const handleEmaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };


    const handleSubmit = async (e:any) => {
        e.preventDefault();
        redefinirSenhaEmail(email);
        setEmail("");
    }

    return <form className="m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full"> <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Digite seu email para redefinir sua senha.
        </h1>
        <div className="mt-[1rem] flex flex-col ">
            <label htmlFor="email" className='mb-1 text-[#999]'>Email</label>
            <input type="email"
            value={email}
            onChange={handleEmaiChange}
            id="email"
            name="email"
            placeholder="email@email.com"
            className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800 " />
        </div>

        <div className='flex'>
            <button
            type="submit"
            onClick={handleSubmit}
            className="mt-[1rem] w-full py-3 bg-[#2ECC71] text-white rounded-md hover:bg-[#27ae60]">
                Resetar Senha
            </button>
        </div>

    </div>
    </form>
}

export default EsqueciSenhaForm;