import React from "react";

interface AvatarProps {
  src?: string; // URL da imagem
  alt?: string; // Texto alternativo
  fallback?: string; // Texto de fallback (como iniciais do nome)
  className?: string; // Classes adicionais para estilização
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, className }) => {
  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span>{fallback || "?"}</span>
      )}
    </div>
  );
};

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="text-sm font-bold">{children}</span>;
};

export const AvatarImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      className="w-full h-full rounded-full object-cover"
    />
  );
};