"use client";

import { useUserContext } from "@/context/UserContext";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{
    verificationToken: string;
  }>;
}

function Page({ params }: Props) {
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );

  const { VerficarUsuario } = useUserContext();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params; // Resolve a Promise
      setVerificationToken(resolvedParams.verificationToken); // Define o token no estado
    };

    resolveParams();
  }, [params]);

  if (!verificationToken) {
    return <div>Carregando...</div>; // Exibe um estado de carregamento enquanto o token é resolvido
  }

  return (
    <div className="Auth-form-container flex flex-col justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md flex flex-col justify-center gap-[1rem] px-[4rem] py-[2rem]">
        <h1 className="text-[2rem]">Verifique sua conta</h1>
        <button
          className="self-center px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          onClick={() => {
            VerficarUsuario(verificationToken);
          }}
        >
          Verificar
        </button>
      </div>
    </div>
  );
}

export default Page;