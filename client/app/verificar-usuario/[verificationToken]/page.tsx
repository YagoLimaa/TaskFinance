"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle, Loader2 } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

interface Props {
  params: Promise<{
    verificationToken: string;
  }>;
}

function Page({ params }: Props) {
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const { VerficarUsuario } = useUserContext();

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params; // Resolve a Promise
        setVerificationToken(resolvedParams.verificationToken); // Define o token no estado
      } catch (error) {
        toast.error("Não foi possível carregar o token de verificação");
      }
    };

    resolveParams();
  }, [params]);

  const handleVerify = async () => {
    if (!verificationToken) return;

    setIsVerifying(true);
    try {
      // Chama a função de verificação de usuário
      await VerficarUsuario(verificationToken);

      // Exibe o estado de sucesso
      setVerified(true);
      toast.success("Sua conta foi verificada com sucesso!");
    } catch (error) {
      toast.error("Não foi possível verificar sua conta. Tente novamente.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border-none">
          <div className="text-center p-6 space-y-1">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
              {verified ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {verified ? "Conta Verificada" : "Verificação de Conta"}
            </h3>
            <p className="text-gray-500">
              {verified
                ? "Sua conta foi verificada com sucesso!"
                : "Clique no botão abaixo para verificar seu email"}
            </p>
          </div>

          <div className="p-6 pt-0 flex flex-col items-center">
            {!verificationToken ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">Carregando token de verificação...</span>
              </div>
            ) : verified ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-600">
                  Você já pode acessar todos os recursos do TaskFinance
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex justify-center p-6 pt-0 pb-6">
            {verificationToken && !verified && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md transition-colors flex items-center justify-center"
                onClick={handleVerify}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar Conta"
                )}
              </button>
            )}

            {verified && (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md transition-colors"
                onClick={() => (window.location.href = "/")}
              >
                Ir para Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;