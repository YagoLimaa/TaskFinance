"use client";

import React, { useEffect } from "react";
import CadastroForm from "../Components/auth/CadastroForm/CadastroForm";

function CadastroPage() {
  useEffect(() => {
    // Remove a classe "dark" do body ao carregar a página
    const interval = setInterval(() => {
      document.body.classList.remove("dark");
    }, 10); // Verifica e remove a classe "dark" a cada 10ms

    // Adiciona a classe "cadastro-page"
    document.body.classList.add("cadastro-page");

    return () => {
      // Limpa o intervalo ao sair da página
      clearInterval(interval);

      // Remove a classe "cadastro-page" e restaura a classe "dark"
      document.body.classList.remove("cadastro-page");
      document.body.classList.add("dark");
    };
  }, []);

  return (
    <div className="Auth-form-container w-full flex justify-center items-center">
      <CadastroForm />
    </div>
  );
}

export default CadastroPage;