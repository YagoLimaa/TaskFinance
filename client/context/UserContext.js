"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";

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

  // Função para manipular os inputs do formulário
  const handlerUserInput = (name) => (e) => {
    let value = e.target.value;

    if (name === "name") {
      value = value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s-]/g, "");
    }

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para registrar um novo usuário
  const registerUser = async (e) => {
    e.preventDefault();

    if (!userState.name) {
      toast.error("Digite seu nome completo!");
      return;
    }

    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/;
    if (!nameRegex.test(userState.name)) {
      toast.error("O nome deve conter apenas letras!");
      return;
    }

    if (!userState.email.includes("@")) {
      toast.error("Digite um email válido!");
      return;
    }

    if (!userState.password) {
      toast.error("Digite uma senha!");
      return;
    }

    if (userState.password.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres!");
      return;
    }

    if (userState.password !== userState.ConfirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/registro`, userState);

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

      toast.error(error.response.data.message);
    }
  };

  // Função para fazer login
  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Login bem-sucedido!");

      // Limpar o formulário
      setUserState({
        email: "",
        password: "",
      });

      // Buscar os dados do usuário logado
      await getUser();

      // Redirecionar para a página inicial
      router.push("/dashboard");
    } catch (error) {
      console.log("Erro ao fazer login", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Verificar status de login do usuário
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
    return loggedIn;
  };

  // Deslogar o usuário
  const logoutUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true,
      });

      toast.success("Logout bem-sucedido!");

      // Redirecionar para a página de login
      router.push("/login");
    } catch (error) {
      console.log("Erro ao fazer logout", error);
      toast.error(error.response.data.message);
    }
  };

  // Pegar detalhes do usuário
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/usuario`, {
        withCredentials: true,
      });
      setUser(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Não foi possível pegar o usuário: ", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Atualizar a bio do usuário
  const UserUpdate = async (id, data, isAdmin = false) => {
    setLoading(true);

    try {
      const url = isAdmin
        ? `${serverUrl}/api/v1/admin/usuario/${id}` // Rota para administradores
        : `${serverUrl}/api/v1/usuario`; // Rota para usuários comuns

      const res = await axios.patch(url, data, {
        withCredentials: true,
      });

      toast.success("Usuário atualizado com sucesso!");
      setLoading(false);

      // Atualizar os dados do usuário logado, se não for admin
      if (!isAdmin) {
        await getUser();
      } else {
        // Atualizar a lista de usuários após a edição (para admins)
        await getUsuarios();
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar o usuário");
      setLoading(false);
    }
  };

  // Verificar email
  const verificacaoEmail = async (e) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verificar-email`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Email de verificação enviado com sucesso!");
      setLoading(false);
    } catch (error) {
      console.log("Erro ao enviar o email de verificação! ", error);

      getUser();
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  // Verificar email do usuário
  const VerficarUsuario = async (verificationToken) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/verificar-usuario/${verificationToken}`,
        {},
        {
          withCredentials: true,
        }
      );
      toast.success("Email verificado com sucesso!");

      // Atualizar os dados do usuário após a verificação
      const updateUsuario = await getUser();
      setUser(updateUsuario);

      setLoading(false);
      router.push("/");
    } catch (error) {
      console.log("Erro ao verificar o email! ", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Esqueci minha senha
  const redefinirSenhaEmail = async (email) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/redefinir-senha`,
        { email },
        {
          withCredentials: true,
        }
      );

      toast.success("Email de redefinição de senha enviado com sucesso!");
      setLoading(false);
    } catch (error) {
      console.log("Erro ao enviar o email de redefinição de senha! ", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Redefinir senha
  const redefinirSenha = async (password, token) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/senha-redefinir/${token}`,
        { password },
        {
          withCredentials: true,
        }
      );

      toast.success("Senha redefinida com sucesso!");
      setLoading(false);
      router.push("/login");
    } catch (error) {
      console.log("Erro ao redefinir a senha! ", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Trocar senha
  const trocarSenha = async (currentPassword, newPassword) => {
    setLoading(true);

    try {
      const res = await axios.patch(
        `${serverUrl}/api/v1/mudar-senha`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
        }
      );

      toast.success("Senha alterada com sucesso!");
      setLoading(false);
    } catch (error) {
      console.log("Erro ao alterar a senha! ", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  // Rotas do ADM
  const getUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/admin/usuarios`, {
        withCredentials: true,
      });
      setAllUsers(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Erro ao pegar todos os usuários: ", error);
      setLoading(false);
    }
  };

  const updateUsuario = async (id, data) => {
    setLoading(true);
    try {
      // Faz a requisição para a nova rota
      const res = await axios.patch(
        `${serverUrl}/api/v1/admin/usuario/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Usuário atualizado com sucesso!");
      setLoading(false);

      // Atualizar a lista de usuários após a edição
      await getUsuarios();
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      toast.error(
        error.response?.data?.message || "Erro ao atualizar o usuário"
      );
      setLoading(false);
    }
  };

  // Apagar usuário
  const deleteUsuario = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${serverUrl}/api/v1/admin/usuario/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Usuário apagado com sucesso!");
      setLoading(false);

      // Atualizar a lista de usuários após a exclusão
      getUsuarios();
    } catch (error) {
      console.log("Erro ao apagar o usuário: ", error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isloggedIn = await userLoginStatus();

      if (isloggedIn) {
        await getUser();
      }
    };
    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin" || user.role === "adminSupremo") {
      getUsuarios();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
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
        allUsers,
        deleteUsuario,
        updateUsuario,
        getUsuarios,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};