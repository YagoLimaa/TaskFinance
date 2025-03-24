"use client"

import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import {useEffect} from "react";


const useRedirect = (redirect: string) => {
    const {userLoginStatus} = useUserContext();
    const router = useRouter();
    useEffect(() => {
        const redirectUser = async () => {
            try {
                const isLoggedUser = await userLoginStatus();
                if (!isLoggedUser) {
                    router.push(redirect);
                }
            } catch (error) {
                console.log("Erro ao redirecionar o usuário: ", error);
            }
        };
        redirectUser();
    }, [redirect, userLoginStatus, router]);
};

export default useRedirect;