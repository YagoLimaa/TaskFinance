"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import { useState } from "react";
import TrocarSenhaForm from "./Components/auth/TrocarSenhaForm/TrocarSenhaForm";

export default function Home() {
  useRedirect("/login");

  const { logoutUser, user, handlerUserInput, userState, UserUpdate, verificacaoEmail, allUsers, deleteUsuario, updateUsuario } = useUserContext();
  const { name, photo, isverified, bio } = user || {}; // Garantir que `user` não seja `undefined`
  const [Open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const bioUpdt = () => {
    setOpen(!Open);
  };

  const openEditPopup = (user: any) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const closeEditPopup = () => {
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex justify-between">
        <h1 className="text-3x1 font-bold">
          Bem-vindo, <strong className="text-blue-500">{name}</strong> ao TaskFinance!
        </h1>

        <div className="flex items-center gap-4">
          <img 
            src={photo}
            alt={name}
            className="w-[40px] h-[40px] rounded-full" 
          />

          {!isverified && (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={verificacaoEmail}
            >
              Verificar e-mail
            </button>
          )}
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Sair
          </button>
        </div>
      </header>

      <section>
        
        <h1>
          <button
            onClick={bioUpdt}
            className="px-4 py-2 bg-[#2ECC71] text-white rounded-md"
          >
            Atualizar bio
          </button>
        </h1>
        {Open && (
          <form className="mt-4 max-w-[400px] w-full">
            <div className="flex flex-col">
              <label htmlFor="bio" className="mb-1 text-[#999]">
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={bio}
                onChange={(e) => handlerUserInput("bio")(e)}
                className="px-4 py-3 border-[2px] border-[#999] outline-[#2ECC71] rounded-md text-gray"
              ></textarea>
            </div>
            <button
              type="submit"
              onClick={(e) => UserUpdate(e, { bio: userState.bio })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Atualizar Bio
            </button>
          </form>
        )}
      </section>
      <div className="mt-4 flex gap-8">
        <div className="flex-1">
          <TrocarSenhaForm />
        </div>
        <div className="flex-1">
          {user.role === "admin" || user.role === "adminSupremo" ? (
            <ul>
              {allUsers
                .filter((u: any) => u._id !== user._id) // Filtra o usuário logado
                .map((user: any) => (
                  <li
                    key={user.id || user._id}
                    className="mb-4 px-2 py-3 border grid grid-cols-4 items-center gap-6 rounded-md border-gray-300"
                  >
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-[40px] h-[40px] rounded-full"
                    />
                    <p>{user.name}</p>
                    <p className="max-h-[70px] overflow-y-auto break-words">
                      {user.bio}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => deleteUsuario(user._id)}>
                        <i className="fas fa-trash text-red-600"></i>
                      </button>
                      <button onClick={() => openEditPopup(user)}>
                        <i className="fas fa-edit text-blue-600"></i>
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : null}

          {isEditOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-[400px] w-full">
                <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedUser) {
                      // Chama a função de atualização com os dados do usuário selecionado
                        updateUsuario(selectedUser._id, {
                        name: selectedUser.name,
                        email: selectedUser.email,
                        bio: selectedUser.bio,
                        role: selectedUser.role,
                      });
                      closeEditPopup(); // Fecha o pop-up após a edição
                    }
                  }}
                >
                  <div className="flex flex-col mb-4">
                    <label htmlFor="name" className="mb-1 text-gray-600">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={selectedUser?.name || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, name: e.target.value })
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
                      value={selectedUser?.email || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, email: e.target.value })
                      }
                      className="px-4 py-2 border rounded-md"
                      disabled={user.role !== "adminSupremo"} // Desabilita o campo se não for adminSupremo
                    />
                    {user.role !== "adminSupremo" && (
                      <p className="text-sm text-gray-500 mt-1">
                        Apenas um Admin Supremo pode editar o e-mail.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="bio" className="mb-1 text-gray-600">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={selectedUser?.bio || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, bio: e.target.value })
                      }
                      className="px-4 py-2 border rounded-md"
                    ></textarea>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="role" className="mb-1 text-gray-600">
                      Role
                    </label>
                    <select
                      id="role"
                      value={selectedUser?.role || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, role: e.target.value })
                      }
                      className="px-4 py-2 border rounded-md"
                      disabled={user.role !== "adminSupremo"} // Desabilita o campo se não for adminSupremo
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="adminSupremo">Admin Supremo</option>
                    </select>
                    {user.role !== "adminSupremo" && (
                      <p className="text-sm text-gray-500 mt-1">
                        Apenas um Admin Supremo pode editar o role.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeEditPopup}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}