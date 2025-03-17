"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from 'react-hot-toast';
import axios from 'axios';
import { Eagle_Lake } from "next/font/google";

const UserContext = React.createContext();

axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {

    const serverUrl = "http://localhost:8000";
    const router = useRouter();

    const [user, setUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
        ConfirmPassword: "",
});

    const [loading, setLoading] = useState(false);

    const registerUser = async (e) => {
        e.preventDefault();

        if(!userState.name){
            toast.error("Digite seu nome completo!");
            return;
        }

    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/;
        if (!nameRegex.test(userState.name)) {
            toast.error("O nome deve conter apenas letras!");
            return;
        }

        if(!userState.email.includes("@")){
            toast.error("Digite um email válido!");
            return;
        }
        if(!userState.password){
            toast.error("Digite uma senha!");
            return;
        }
        if (userState.password.length < 8){
            toast.error("A senha deve ter no mínimo 8 caracteres!");
            return;
        }
        if (userState.password !== userState.ConfirmPassword){
            toast.error("As senhas não coincidem!");
            return;
        }
        try {
            const res = await axios.post(`${serverUrl}/api/v1/registro`, userState);
            console.log("Registro: ", res.data);

            toast.success("Registro bem-sucedido!");

            setUserState({
                name: "",
                email: "",
                password: "",
                ConfirmPassword: "",
            });

            router.push("/login");
        } catch (error) {
            console.log("Erro ao se registrar: ", error);

            toast.error(error.response.data.message)
        }
};

// fazer login do usuario
    const loginUser = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${serverUrl}/api/v1/login`, {
            email: userState.email,
            password: userState.password,
        }, {
            withCredentials: true,
        }
    );

    toast.success("Login bem-sucedido!");

    // limpar o formulario
    setUserState({
        email: "",
        password: "",
       
    });


      // push user to the dashboard page
      router.push("/");

    } catch (error) {
        console.log("Erro ao fazer login", error);
        toast.error(error.response.data.message);
        
    }
};

// deslogar o usuario
    const logoutUser = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true,
        });

        toast.success("Logout bem-sucedido!");

        // push user to the login page
        router.push("/login");
        } catch (error) {
            console.log("Erro ao fazer logout", error);
            toast.error(error.response.data.message);       
        }
    };

const handlerUserInput = (name) => (e) => {
    let value = e.target.value;

if (name === "name") {
        value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s-]/g, '');
    }
    setUserState((prevState) => ({
        ...prevState,
        [name]: value,
    }));
};
// verificar status de login do usuario

    const userLoginStatus = async () => {
    let loggedIn = false;
    try {
        const res = await axios.get(`${serverUrl}/api/v1/status`, {
            withCredentials: true, 
        });

        loggedIn = !!res.data;

        setLoading(false);

        if (!loggedIn) {
            router.push("/login");
        }
    } catch (error) {
        console.log("Erro ao verificar status de login", error);
    }

    console.log("usuario logado:", loggedIn);
    
    return loggedIn;
};


useEffect(() => {
   userLoginStatus();
}, [])


return (
    <UserContext.Provider value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser
        }}>
        {children}
    </UserContext.Provider>
    );
};
export const useUserContext = () => {
    return useContext(UserContext);
}