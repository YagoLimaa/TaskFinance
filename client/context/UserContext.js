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

  const [user, setUser] = useState({}); // Inicializa como um objeto vazio
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Função para buscar a lista de usuários
  const getUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/api/v1/admin/usuarios`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Inclui o token no cabeçalho
        },
      });

      setAllUsers(response.data); // Atualiza a lista de usuários no estado global
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error(error.response?.data?.message || "Erro ao buscar usuários");
      setLoading(false);
    }
  };

  // Atualizar o perfil do usuário ou outro usuário
  const UserUpdate = async (id, updatedUser) => {
    try {
      setLoading(true);

      // Define a URL com base no ID (atualiza outro usuário ou o próprio perfil)
      const url = id
        ? `${serverUrl}/api/v1/admin/usuario/${id}`
        : `${serverUrl}/api/v1/usuario`;

      const response = await axios.patch(url, updatedUser, {
        withCredentials: true,
      });

      toast.success("Usuário atualizado com sucesso!");

      if (id) {
        // Atualiza a lista de usuários se for um admin alterando outro usuário
        await getUsuarios();
      } else {
        // Atualiza o estado do próprio usuário
        setUser(response.data.user);

        // Se o usuário logado for admin ou adminSupremo, recarrega a lista de usuários
        if (response.data.user.role === "admin" || response.data.user.role === "adminSupremo") {
          await getUsuarios();
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar o usuário");
      setLoading(false);
    }
  };

  // Carregar os dados do usuário logado
  const getUser = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/v1/usuario`, {
        withCredentials: true,
      });
      setUser(res.data || {}); // Garante que `user` nunca seja `null`
      setLoading(false);
      return res.data;
    } catch (error) {
      console.log("Não foi possível pegar o usuário: ", error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Erro ao carregar o usuário");
    }
  };

  // useEffect para carregar os dados do usuário logado e a lista de usuários
  useEffect(() => {
    const loginStatusGetUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/v1/status`, {
          withCredentials: true,
        });

        if (res.data) {
          const userData = await getUser();
          setUser(userData);

          // Se o usuário logado for admin ou adminSupremo, carrega a lista de usuários
          if (userData.role === "admin" || userData.role === "adminSupremo") {
            await getUsuarios();
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.log("Erro ao verificar status de login", error);
        router.push("/login");
      }
    };

    loginStatusGetUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        getUser,
        getUsuarios,
        UserUpdate,
        setUser,
        setAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};