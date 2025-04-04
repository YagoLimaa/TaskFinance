// filepath: c:\Users\yagoD\Desktop\lista\client\app\configuracoes\page.tsx
"use client";

import Navbar from "@/app/Components/Navbar/Navbar";
import { useThemeContext } from "@/context/ThemeContext";

export default function Configuracoes() {
  const { isDarkMode, toggleDarkMode } = useThemeContext();

  return (
    <>
      <Navbar />
      <main className="py-[2rem] mx-[10rem]">
        <h1 className="text-2xl font-bold mb-4">Configurações</h1>

        {/* Configuração de Modo Escuro */}
        <div className="mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Aparência
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Ative o modo escuro para uma experiência mais confortável em ambientes com pouca luz.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="darkModeToggle" className="text-gray-700 dark:text-gray-300">
                Modo Escuro
              </label>
              <input
                type="checkbox"
                id="darkModeToggle"
                checked={isDarkMode}
                onChange={toggleDarkMode}
                className="w-6 h-6"
              />
            </div>
          </div>
        </div>

        {/* Configurações de Finanças */}
        <div className="mb-8 p-4 border rounded-lg bg-blue-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
            Configurações de Finanças
          </h2>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li className="mb-2">Definir moeda padrão (ex.: BRL, USD, EUR).</li>
            <li className="mb-2">Configurar lembretes para pagamentos de contas.</li>
            <li className="mb-2">Habilitar notificações para metas financeiras.</li>
          </ul>
        </div>

        {/* Configurações de Tasks */}
        <div className="p-4 border rounded-lg bg-green-50 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
            Configurações de Tasks
          </h2>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
            <li className="mb-2">Escolher notificações para tarefas pendentes.</li>
            <li className="mb-2">Definir prioridade padrão para novas tarefas.</li>
            <li className="mb-2">Habilitar integração com calendários (ex.: Google Calendar).</li>
          </ul>
        </div>
      </main>
    </>
  );
}