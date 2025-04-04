"use client";

import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/app/Components/Navbar/Navbar"
import { Search, Trash2, Edit, X } from "lucide-react";

export default function Users() {
  const { allUsers, getUsuarios, deleteUsuario, user, UserUpdate } = useUserContext();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    _id: "",
    name: "",
    email: "",
    bio: "",
    role: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getUsuarios(); // Carrega os usuários ao carregar a página
  }, []);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "adminSupremo")) {
      return;
    }

    const usersWithoutLoggedIn = allUsers.filter((u: any) => u._id !== user?._id);

    if (searchTerm.trim() === "") {
      setFilteredUsers(usersWithoutLoggedIn);
    } else {
      const filtered = usersWithoutLoggedIn.filter(
        (u: any) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers, user]);

  const handleOpenEditUser = (userToEdit: any) => {
    setUpdatedUser({
      _id: userToEdit._id || "",
      name: userToEdit.name || "",
      email: userToEdit.email || "",
      bio: userToEdit.bio || "",
      role: userToEdit.role || "",
    });
    setIsEditUserOpen(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updatedUser._id) {
      console.error("Erro: ID do usuário não encontrado.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedUser.email)) {
      toast.error("Por favor, insira um e-mail válido!");
      return;
    }

    try {
      const originalUser = allUsers.find((u: any) => u._id === updatedUser._id);
      if (originalUser && updatedUser.email !== originalUser.email) {
        const emailExists = allUsers.some(
          (u: any) => u.email === updatedUser.email && u._id !== updatedUser._id
        );

        if (emailExists) {
          toast.error("Este e-mail já está em uso. Escolha outro.");
          return;
        }
      }

      await UserUpdate(updatedUser._id, updatedUser);
      setIsEditUserOpen(false);
      toast.success("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      toast.error("Erro ao atualizar o usuário.");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  if (!user || (user.role !== "admin" && user.role !== "adminSupremo")) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
          <div className="relative">
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 w-64 focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <div className="px-3 py-2 bg-gray-100">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              user.photo ||
                              "https://p1.hiclipart.com/preview/227/359/624/education-icon-avatar-student-share-icon-user-user-profile-education-purple-png-clipart.jpg"
                            }
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {user.bio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" || user.role === "adminSupremo"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
                              deleteUsuario(user._id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isEditUserOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Usuário</h2>
                <button
                  onClick={() => setIsEditUserOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditUserSubmit} noValidate>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={updatedUser.name}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={updatedUser.email}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={updatedUser.bio}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-1">
                    Função
                  </label>
                  <select
                    id="role"
                    value={updatedUser.role}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                    {user?.role === "adminSupremo" && (
                      <option value="adminSupremo">Admin Supremo</option>
                    )}
                  </select>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditUserOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}