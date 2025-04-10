"use client";
import React from "react";
import { useUserContext } from "@/context/UserContext";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

function LoginPage() {
  const { loginUser, userState, handlerUserInput } = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/30 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">TF</span>
            </div>
            <span className="ml-2 text-xl font-semibold">TaskFinance</span>
          </a>
          <h1 className="text-3xl font-bold">Entre na sua conta</h1>
          <p className="text-gray-500 mt-2">
            Entre agora. Não tem uma conta?{"  "}
            <a
              href="/cadastro"
              className="text-[] font-medium hover:text-[lightgreen] transition-colors hover:underline"
            >
              Se Registre
            </a>
          </p>
        </div>

        <form
          onSubmit={loginUser}
          className="relative bg-white p-8 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="relative z-10 space-y-6">
            {/* Campo de Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-gray-800"> {/* Texto mais escuro */}
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => handlerUserInput("email")(e)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] outline-none text-gray-800 placeholder-gray-600"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-gray-800"> {/* Texto mais escuro */}
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => handlerUserInput("password")(e)}
                  placeholder="••••••••"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.5)] outline-none text-gray-800 placeholder-gray-600"
                />
                <button
                  type="button"
                  className="absolute right-3 top-[50%] transform -translate-y-1/2 text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <a
                  href="/redefinir-senha"
                  className="font-bold text-green-600 text-sm hover:text-green-500 transition-all duration-300"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={!email || !password}
              className="w-full px-4 py-3 font-bold bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            TaskFinance - Organize suas finanças e tarefas de forma simples e
            eficiente
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;