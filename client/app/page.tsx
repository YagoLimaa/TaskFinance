"use client";

import { useUserContext } from "@/context/UserContext";
import useRedirect from "@/hook/useUserRedirect";
import Navbar from "@/app/Components/Navbar/Navbar";

export default function Home() {
  useRedirect("/login");

  const { user, verificacaoEmail } = useUserContext();
  const { isverified } = user || {}; // Garantir que `user` não seja `undefined`

  return (
    <>
      <Navbar />
      <main className="py-[2rem] mx-[10rem]">
        <header className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            {/* Botão para verificar o e-mail */}
            {!isverified && (
              <button
                onClick={verificacaoEmail}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md"
              >
                Verificar E-mail
              </button>
            )}
          </div>
        </header>

        <section>
          {/* Conteúdo adicional pode ser adicionado aqui */}
        </section>
      </main>
    </>
  );
}