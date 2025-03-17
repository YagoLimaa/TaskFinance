"use client";

import { useUserContext } from "@/context/UserContext";

export default function Home() {
  // Obtenha todos os valores necessários de uma só vez
  const { userState, logoutUser } = useUserContext();
  const name = 'Yago'
  
  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex items-center justify-between">
        <h1 className="text-[2rem] font-bold">
          Bem-vindo, <strong className="text-blue-500">{name}</strong> ao TaskFinance!
        </h1>

        <div className="flex items-center gap-4">
          <img src="/client/public/avatar.png" alt="" />

          <button onClick={logoutUser} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Sair
          </button>
        </div>
      </header>
    </main>
  );
}