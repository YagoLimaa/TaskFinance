"use client";

import { useUserContext } from '@/context/UserContext';
import React from 'react';
interface Props {
    params: {
        verificationToken: string;
    };
}

function page({ params }: Props) {

    const {verificationToken} = params;

    const {VerficarUsuario} = useUserContext();

    return <div className="Auth-form-container flex flex-col justify-center items-center">

    <div className='bg-white p-4 rounded-md shadow-md flex flex-col justift-center gap-[1rem] px-[4rem] py-[2rem]'> 
    <h1 className=' text-[2rem]'>Verifique sua conta</h1>
            <button className=' self-center px-4 py-2 bg-blue-500 text-white rounded-md mt-4'
                onClick = { () => {
                    VerficarUsuario(verificationToken);
                }}
                >
                Verificar
            </button>
    </div>

        </div>

    }


export default page;