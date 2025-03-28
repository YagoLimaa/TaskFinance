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
    setLoading(true);
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

       // Buscar os dados do usuário logado
       await getUser();

      // push user to the dashboard page
      router.push("/");

    } catch (error) {
        console.log("Erro ao fazer login", error);
        toast.error(error.response.data.message);
        
    } finally {
        setLoading(false);
    }
};

// verificar status de login do usuario 
const userLoginStatus = async () => { // Refazer essa funcao de verificacao depois
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
    console.log("Usuario está logado:  ", loggedIn);
    return loggedIn;
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

// pegar detalhes do usuario
    const getUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/usuario`,{
                withCredentials: true, 
            });
            setUser(res.data);
            setLoading(false);
            return res.data;
        } catch (error) {
            console.log("Não foi possivel pegar o usuario: ", error);
            setLoading(false);
            toast.error(error.response.data.message)
        }
};

// atualizar a bio do usuario
const UserUpdate = async (e, data) => {
    e.preventDefault();
    setLoading(true);

    try {
        const res = await axios.patch(`${serverUrl}/api/v1/usuario`, data, {
            withCredentials: true,
        });
        // atualizar estado do usuario
        setUser((prevState) => {
            return {
                ...prevState,
                ...res.data,
            };
        });
        toast.success("Bio atualizada com sucesso!");
        setLoading(false);

    } catch (error) {
        console.log("Erro ao atualizar a bio do usuario: ", error);
        setLoading(false);
        toast.error(error.response.data.message);
    }
    
};


// verificar email 
const verificacaoEmail = async (e) => {
    setLoading(true);
    try {
        const res = await axios.post(`${serverUrl}/api/v1/verificar-email`,{}, {
            withCredentials: true,
        });
        toast.success("Email de verificação enviado com sucesso!");
        setLoading(false);
    } catch (error) {
        
        console.log("Erro ao enviar o email de verificação! ", error);

        getUser();
        setLoading(false);
        toast.error(error.response.data.message);
    }
}

// verificar email do usuario
const VerficarUsuario = async (verificationToken) => {
    setLoading(true);
    try {
        const res = await axios.post(`${serverUrl}/api/v1/verificar-usuario/${verificationToken}`,{}, {
            withCredentials: true,
        }
    );
        toast.success("Email verificado com sucesso!");

           // Atualizar os dados do usuário após a verificação
           const updateUsario = await getUser();
            setUser(updateUsario);

        setLoading(false);
        router.push("/");

    } catch (error) {
        
        console.log("Erro ao verificar o email! ", error);
        toast.error(error.response.data.message);
        setLoading(false);
    }
}

//Esqueci minha senha

const redefinirSenhaEmail = async (email) => { 
    setLoading(true);

    try {
        const res = await axios.post(`${serverUrl}/api/v1/redefinir-senha`, {email}, {
            withCredentials: true,
        });

        toast.success("Email de redefinição de senha enviado com sucesso!");
        setLoading(false);
        

    } catch (error) {
        console.log("Erro ao enviar o email de redefinição de senha! ", error);
        toast.error(error.response.data.message);
        setLoading(false);
        
    }

};

// Esqueci minha senha
const redefinirSenha = async (password, token) => {
    setLoading(true);

    try {
        const res = await axios.patch(`${serverUrl}/api/v1/senha-redefinir/${token}`, {password,}, 
        {
            withCredentials: true,
        });

        toast.success("Senha redefinida com sucesso!");
        setLoading(false);
        router.push("/login");

    } catch (error) {
        console.log("Erro ao redefinir a senha! ", error);
        toast.error(error.response.data.message);
        setLoading(false);
    }
}

// trocar senha
const trocarSenha = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
        const res = await axios.patch(`${serverUrl}/api/v1/mudar-senha`, {currentPassword, newPassword}, {
            withCredentials: true,
        });

        toast.success("1Senha alterada com sucesso!");
        setLoading(false);
    } catch (error) {
        console.log("Erro ao alterar a senha! ", error);
        toast.error(error.response.data.message);
        setLoading(false);
    }
}

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

useEffect(() => {
    const loginStatusGetUser = async () => {
        const isloggedIn = await userLoginStatus();

        console.log("Usuario está logado2: ", isloggedIn);
        
        if (isloggedIn) {
            await getUser();
        }
    };
    loginStatusGetUser();
}, []);

console.log("Usuario: ", user);

return (
    <UserContext.Provider value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        getUser,
        user,
        UserUpdate,
        verificacaoEmail,
        VerficarUsuario,
        redefinirSenhaEmail,
        redefinirSenha,
        trocarSenha,
        }}>
        {children}
    </UserContext.Provider>
    );
};
export const useUserContext = () => {
    return useContext(UserContext);
}