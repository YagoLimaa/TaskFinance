"use client";

import { useUserContext } from "@/context/UserContext";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function TrocarSenhaForm() {
  const { trocarSenha } = useUserContext();
  const [currentPassword, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("A nova senha não pode ser igual à senha atual");
      return;
    }

    try {
      await trocarSenha(currentPassword, newPassword);

      setPassword("");
      setNewPassword("");
    } catch (error: any) {
      console.error("Erro ao trocar a senha:", error);
      toast.error(error.response?.data?.message || "Erro ao trocar a senha");
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

  return (
    <form
      onSubmit={handleSubmit}
      className="m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full"
    >
      <div className="relative z-10">
        <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          Alterar sua senha
        </h1>

        {/* Senha Atual */}
        <div className="flex flex-col mt-4">
          <label htmlFor="password" className="mb-1 text-[#999]">
            Senha Atual
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={currentPassword}
              onChange={(e) => setPassword(e.target.value)}
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

        {/* Nova Senha */}
        <div className="flex flex-col mt-4">
          <label htmlFor="newPassword" className="mb-1 text-[#999]">
            Nova Senha
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 px-4 py-2 border border-[#ccc] rounded-lg focus:border-[blue] focus:shadow-[0_0_0_2px_rgba(0,0,255,0.2)] outline-none"
            />
            <button
              type="button"
              className="absolute right-3 top-[50%] transform -translate-y-1/2 text-[22px] text-[#999] opacity-45"
              onClick={toggleNewPassword}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          onSubmit={handleSubmit}
          className="mt-6 w-full px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors"
        >
          Alterar Senha
        </button>
      </div>
    </form>
  );
}

export default TrocarSenhaForm;