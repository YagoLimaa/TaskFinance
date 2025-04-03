"use client";

import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Users() {
  const { allUsers, getUsuarios, deleteUsuario, user, UserUpdate } = useUserContext();
  const [isEditUserOpen, setIsEditUserOpen] = useState(false); // Controla o formulário de edição de outros usuários
  const [updatedUser, setUpdatedUser] = useState({
    _id: "",
    name: "",
    email: "",
    bio: "",
    role: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [filteredUsers, setFilteredUsers] = useState([]); // Lista de usuários filtrados

  const router = useRouter(); // Hook para navegação

  useEffect(() => {
    // Carrega a lista de usuários ao carregar a página
    getUsuarios();
  }, []);

  useEffect(() => {
    // Atualiza a lista de usuários filtrados quando o termo de busca muda
    const usersWithoutLoggedIn = allUsers.filter(
      (u: any) => u._id !== user?._id // Remove o usuário logado da lista
    );

    if (searchTerm.trim() === "") {
      setFilteredUsers(usersWithoutLoggedIn); // Mostra todos os usuários (exceto o logado) se o termo de busca estiver vazio
    } else {
      const filtered = usersWithoutLoggedIn.filter(
        (u: any) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers, user]);

  if (user?.role !== "admin" && user?.role !== "adminSupremo") {
    return <p>Você não tem permissão para acessar esta página.</p>;
  }

  // Função para abrir o formulário de edição de outro usuário
  const handleOpenEditUser = (userToEdit: any) => {
    setUpdatedUser({
      _id: userToEdit._id || "",
      name: userToEdit.name || "",
      email: userToEdit.email || "",
      bio: userToEdit.bio || "",
      role: userToEdit.role || "",
    });
    setIsEditUserOpen(true); // Abre o formulário
  };

  // Função para salvar as alterações de outro usuário
  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!updatedUser._id) {
      console.error("Erro: ID do usuário não encontrado.");
      return;
    }

    try {
      // Verifica se o e-mail já está em uso por outro usuário
      const response = await fetch(`/api/usuarios/verificar-email?email=${updatedUser.email}`);
      const emailExists = await response.json();

      if (emailExists && updatedUser.email !== user.email) {
        alert("O e-mail já está em uso por outro usuário.");
        return;
      }

      // Atualiza os dados do usuário
      UserUpdate(updatedUser._id, updatedUser);
      setIsEditUserOpen(false); // Fecha o formulário após salvar
    } catch (error) {
      console.error("Erro ao verificar o e-mail:", error);
    }
  };

  // Função para limpar o campo de busca e mostrar todos os usuários
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <main className="py-[2rem] mx-[10rem]">
      {/* Navbar */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img
            src={user?.photo || "https://via.placeholder.com/40"}
            alt={user?.name || "Usuário"}
            className="w-[30px] h-[30px] rounded-full"
          />
          <h1 className="text-xl font-bold">
            Bem-vindo, <strong className="text-blue-500">{user?.name}</strong>!
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")} // Redireciona para a página principal
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Voltar
          </button>
          <button
            onClick={() => router.push("/login")} // Exemplo de logout
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Título e Campo de Busca */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleClearSearch} // Limpa a busca e mostra todos os usuários
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <ul className="w-full max-w-[600px]">
        {filteredUsers.map((user: any) => (
          <li
            key={user._id}
            className="mb-4 px-2 py-3 border grid grid-cols-4 items-center gap-6 rounded-md border-gray-300"
          >
            <img
              src={user.photo || "https://via.placeholder.com/40"}
              alt={user.name}
              className="w-[40px] h-[40px] rounded-full"
            />
            <p>{user.name}</p>
            <p className="max-h-[70px] overflow-y-auto break-words">{user.bio}</p>
            <div className="flex gap-2">
              {/* Botão de exclusão */}
              <button
                onClick={() => {
                  if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
                    deleteUsuario(user._id); // Chama a função para deletar o usuário
                  }
                }}
                className="text-red-600"
              >
                <i className="fas fa-trash"></i>
              </button>
              {/* Botão de edição */}
              <button
                onClick={() => handleOpenEditUser(user)} // Abre o formulário de edição de outro usuário
                className="text-blue-600"
              >
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Formulário de Edição de Outro Usuário */}
      {isEditUserOpen && (
        <div className="mt-4 max-w-[400px] w-full">
          <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
          <form onSubmit={handleEditUserSubmit}>
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
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, email: e.target.value })
                } // Permite alterar o e-mail
                className="px-4 py-2 border rounded-md"
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
                onClick={() => setIsEditUserOpen(false)} // Fecha o formulário de edição
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}