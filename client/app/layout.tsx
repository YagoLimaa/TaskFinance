import type { Metadata } from "next";

import "./globals.css";
import "./themes.css"; // Importa os estilos dos temas

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserContextProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "Configurações - TaskFinance",
  description: "Gerencie suas configurações de aparência e preferências.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Toaster position="bottom-right" />
        <ThemeProvider>
          <UserContextProvider>{children}</UserContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
