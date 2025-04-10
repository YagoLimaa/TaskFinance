"use client";

import React, { useEffect } from "react";
import LoginForm from "../Components/auth/LoginForm/LoginForm";

function LoginPage() {
  useEffect(() => {
    // Adiciona a classe "login-page" e remove "dark"
    document.body.classList.add("login-page");
    document.body.classList.remove("dark");

    return () => {
      // Remove a classe "login-page" ao sair da página
      document.body.classList.remove("login-page");
      document.body.classList.add("dark"); // Restaura o tema escuro
    };
  }, []);

  return (
    <div className="Auth-form-container w-full flex justify-center items-center">
      <LoginForm />
    </div>
  );
}

export default LoginPage;