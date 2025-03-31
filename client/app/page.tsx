"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import { useState } from "react";
import TrocarSenhaForm from "./Components/auth/TrocarSenhaForm/TrocarSenhaForm";

export default function Home() {
  useRedirect("/login");

  const { logoutUser, user, handlerUserInput, userState, UserUpdate, verificacaoEmail, allUsers, deleteUsuario } = useUserContext();
  const { name, photo, isverified, bio } = user || {}; // Garantir que `user` não seja `undefined`
  const [Open, setOpen] = useState(false);

  const bioUpdt = () => {
    setOpen(!Open);
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
                    <button onClick={() => deleteUsuario(user._id)}>
                      <i className="fas fa-trash text-red-600"></i>
                    </button>
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      </div>
      
    </main>
  );
}