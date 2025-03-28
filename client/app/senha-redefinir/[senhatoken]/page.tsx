"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Use o hook useParams
import { useUserContext } from "@/context/UserContext";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/app/Components/axiosInstance.js";

function Page() {
  const router = useRouter();
  const params = useParams(); // Obtenha os parâmetros da URL
  const [isValidToken, setIsValidToken] = useState(false); // Estado para controlar a validade do token
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento inicial

  const { redefinirSenha } = useUserContext();
  const { userState, handlerUserInput } = useUserContext();
  const { password, ConfirmPassword } = userState;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validação do token no carregamento da página
  useEffect(() => {
    const validateToken = async () => {
      const token = Array.isArray(params.senhatoken)
        ? params.senhatoken[0]
        : params.senhatoken;
      console.log("esse é o token:  ", token);
    
      if (!token) {
        toast.error("Token inválido ou ausente");
        router.replace("/login");
        return;
      }
    
      try {
        // Faz uma requisição ao backend para validar o token
        const response = await axiosInstance.get(`/validate-token/${token}`);
        if (response.data.valid) {
          setIsValidToken(true); // Token válido
        } else {
          toast.error("Token expirado ou inválido");
          router.replace("/login"); // Redireciona para a página de login
        }
      } catch (error) {
        console.error("Erro ao validar o token:", error);
        toast.error("Erro ao validar o token");
        router.replace("/login"); // Redireciona para a página de login
      } finally {
        setIsLoading(false); // Conclui o carregamento
      }
    };

    validateToken();
  }, [params, router]);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password !== ConfirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      await redefinirSenha(password, params.senhatoken);
      toast.success("Senha redefinida com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      console.error("Erro ao redefinir a senha:", error);
      toast.error(error.response?.data?.message || "Erro ao redefinir a senha");
    }
  };

  // Exibe um estado de carregamento enquanto valida o token
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se o token for inválido, o redirecionamento já terá ocorrido
  if (!isValidToken) {
    return null;
  }

  return (
    <main className="Auth-form-container w-full h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full"
      >
        <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
            Resete sua senha!
          </h1>

          {/* Nova Senha */}
          <div className="flex flex-col mt-4">
            <label htmlFor="password" className="mb-1 text-[#999]">
              Nova senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => handlerUserInput("password")(e)}
                placeholder="••••••••"
                className="w-full pl-10 px-4 py-2 border border-[#ccc] rounded-lg focus:border-[blue] focus:shadow-[0_0_0_2px_rgba(0,0,255,0.2)] outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-[50%] transform -translate-y-1/2 text-[22px] text-[#999] opacity-45"
                onClick={togglePassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div className="flex flex-col mt-4">
            <label htmlFor="confirmPassword" className="mb-1 text-[#999]">
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="ConfirmPassword"
                id="confirmPassword"
                value={ConfirmPassword}
                onChange={(e) => handlerUserInput("ConfirmPassword")(e)}
                placeholder="••••••••"
                className="w-full pl-10 px-4 py-2 border border-[#ccc] rounded-lg focus:border-[blue] focus:shadow-[0_0_0_2px_rgba(0,0,255,0.2)] outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-[50%] transform -translate-y-1/2 text-[22px] text-[#999] opacity-45"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
          >
            Redefinir Senha
          </button>
        </div>
      </form>
    </main>
  );
}

export default Page;