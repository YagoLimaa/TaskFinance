"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importa o useRouter
import { useUserContext } from "@/context/UserContext";
import { useThemeContext } from "@/context/ThemeContext"; // Importa o ThemeContext
import { Avatar } from "@/app/Components/ui/Avatar";
import { LogOut, User, Settings } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useUserContext();
  const { isDarkMode } = useThemeContext(); // Obtém o estado do tema
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); // Instância do useRouter

  const handleNavigation = (path: string) => {
    router.push(path); // Redireciona para a rota especificada
    setIsDropdownOpen(false); // Fecha o dropdown após o clique
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header
      className={`py-4 transition-colors ${
        isDarkMode ? "bg-gray-800 text-gray-100 dark-mode" : "bg-white text-gray-900"
      }`}
    >
      <div className="mx-4 px-4 flex justify-between items-center">
        {/* Logo e Navegação */}
        <div className="flex items-center">
          <button
            onClick={() => handleNavigation("/")}
            className={`text-xl font-bold ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            TaskFinance
          </button>
          <nav>
            <ul className="flex ml-6">
              <li>
                <button
                  onClick={() => handleNavigation("/")}
                  className="navbar-link" // Reaproveita o estilo de link
                >
                  Home
                </button>
              </li>
              {user?.role === "admin" || user?.role === "adminSupremo" ? (
                <li className="ml-6">
                  <button
                    onClick={() => handleNavigation("/usuarios")}
                    className="navbar-link" // Reaproveita o estilo de link
                  >
                    Usuários
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        {/* Dropdown do Usuário */}
        {user ? (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="focus:outline-none flex items-center gap-2"
            >
              <Avatar
                src={user?.photo || undefined}
                alt={user?.name || "Usuário"}
                fallback={getInitials(user?.name || "Usuário")}
                className="cursor-pointer"
              />
            </button>
            {isDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700 text-gray-100"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <div className="px-4 py-2 text-sm font-semibold">
                  Minha Conta
                </div>
                <div className="border-t transition-colors border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={() => handleNavigation("/perfil")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  Perfil
                </button>
                <button
                  onClick={() => handleNavigation("/configuracoes")}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="inline-block mr-2 h-4 w-4" />
                  Configurações
                </button>
                <div className="border-t transition-colors border-gray-200 dark:border-gray-700"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          // Links para Login e Cadastro
          <div className="flex">
            <button
              onClick={() => handleNavigation("/login")}
              className={`px-4 py-2 transition-colors ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => handleNavigation("/cadastro")}
              className={`px-4 py-2 ml-4 rounded-md transition-colors ${
                isDarkMode
                  ? "bg-blue-400 text-gray-100 hover:bg-blue-300"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Cadastrar
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
