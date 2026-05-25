// src/components/logos-sistema.tsx
import React from 'react';

// 🟢 Escudo Oficial con tu imagen real para la pantalla de Login
export function EscudoLogin() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Llamamos a tu imagen desde la carpeta public */}
      <img 
        src="/imagenagua.png" 
        alt="Gestión Comunitaria de Agua" 
        className="w-80 h-100 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
      />
      
    </div>
  );
}

// Icono compacto para la esquina superior del Menú Lateral (Sidebar)
export function IconoMenu() {
  return (
    <img 
      src="/imagenagua.png" 
      alt="Logo Menú" 
      className="w-45 h-15 object-contain rounded-md"
    />
  );
}