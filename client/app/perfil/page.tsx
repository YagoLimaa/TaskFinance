"use client";

import { useState } from "react";
import { useUserContext } from "@/context/UserContext";
import Navbar from "@/app/Components/Navbar/Navbar"; // Importa a Navbar

export default function EditProfile() {
  const { user, UserUpdate } = useUserContext();
  const { name, email, bio, photo } = user || {}; // Inclui a foto do usuário
  const [updatedUser, setUpdatedUser] = useState({
    name: name || "",
    email: email || "",
    bio: bio || "",
    photo: photo || "",
  });

  // Função para salvar as alterações no próprio perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Atualizar o próprio perfil
      await UserUpdate(null, updatedUser, false);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  return (
    <>
      <Navbar /> {/* Adiciona a Navbar */}
      <div className="mt-4 max-w-[800px] w-full mx-auto flex gap-8">
        {/* Campo para alterar a foto de perfil */}
        <div className="flex flex-col items-center">
          <img
            src={
              updatedUser.photo ||
              "https://p1.hiclipart.com/preview/227/359/624/education-icon-avatar-student-share-icon-user-user-profile-education-purple-png-clipart.jpg"
            }
            alt="Foto de Perfil"
            className="w-[120px] h-[120px] rounded-full border border-gray-300 object-cover"
          />
          <label
            htmlFor="photo"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            Alterar Foto
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setUpdatedUser({ ...updatedUser, photo: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        {/* Formulário de Edição de Perfil */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">
            Bem-vindo, <span className="text-blue-500">{name}</span>
          </h1>

          <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
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
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="px-4 py-2 bg-[#2ECC71] text-white rounded-md"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Parágrafo explicativo */}
      <div className="mt-8 max-w-[800px] w-full mx-auto">
        <p className="text-gray-600 text-lg">
          Para implementar a lógica de envio da foto de perfil para o banco de dados, 
          será necessário criar uma API no backend que receba a imagem enviada pelo 
          usuário. Essa API deve processar o arquivo, armazená-lo em um serviço de 
          armazenamento (como AWS S3, Google Cloud Storage ou o próprio servidor) e 
          salvar o link da imagem no banco de dados. No frontend, você pode usar o 
          método <code>fetch</code> ou uma biblioteca como <code>axios</code> para 
          enviar a imagem para o backend.
        </p>
      </div>
    </>
  );
}