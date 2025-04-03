"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  useRedirect("/login");

  const { logoutUser, user, UserUpdate } = useUserContext();
  const { name, photo, email, bio, role } = user || {}; // Garantir que `user` não seja `undefined`
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // Controla o formulário de edição de perfil
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const router = useRouter(); // Hook para navegação

  // Função para abrir o formulário de edição do próprio perfil
  const handleOpenEditProfile = () => {
    setUpdatedUser({
      name: name || "",
      email: email || "",
      bio: bio || "",
    });
    setIsEditProfileOpen(true); // Abre o formulário
  };

  // Função para salvar as alterações no próprio perfil
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    UserUpdate(null, updatedUser); // Passa `null` como ID para indicar que é o próprio perfil
    setIsEditProfileOpen(false); // Fecha o formulário após salvar
  };

  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={photo || "https://via.placeholder.com/40"}
            alt={name || "Usuário"}
            className="w-[40px] h-[40px] rounded-full"
          />
          <h1 className="text-3x1 font-bold">
          Bem-vindo, <strong className="text-blue-500">{name}</strong> ao TaskFinance!
        </h1>
        </div>
        <div className="flex gap-4">
          {/* Botão para redirecionar para a página de usuários */}
          {role === "admin" || role === "adminSupremo" ? (
            <button
              onClick={() => router.push("/usuarios")} // Redireciona para a página de usuários
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Usuários
            </button>
          ) : null}
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Sair
          </button>
        </div>
      </header>

      <section>
        <button
          onClick={handleOpenEditProfile}
          className="px-4 py-2 bg-[#2ECC71] text-white rounded-md"
        >
          Atualizar Perfil
        </button>

        {isEditProfileOpen && (
          <div className="mt-4 max-w-[400px] w-full">
            <form onSubmit={handleProfileSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-1 text-gray-600">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={updatedUser.name}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, name: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="email" className="mb-1 text-gray-600">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={updatedUser.email}
                  disabled // O próprio usuário não pode alterar o e-mail
                  className="px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="bio" className="mb-1 text-gray-600">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={updatedUser.bio}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, bio: e.target.value })
                  }
                  className="px-4 py-2 border rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)} // Fecha o formulário de edição
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2ECC71] text-white rounded-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}