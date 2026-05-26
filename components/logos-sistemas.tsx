// src/components/logos-sistema.tsx
import React from 'react';

// ==========================================
// 🔵 VARIANTES PARA FAMILIA Y PANTALLA DE LOGIN (Imagen estándar / Azul)
// ==========================================

// Escudo Oficial con tu imagen real para la pantalla de Login y Portal Familiar
export function EscudoLogin() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Llamamos a tu imagen estándar desde la carpeta public */}
      <img 
        src="/imagenagua.png" 
        alt="Gestión Comunitaria de Agua" 
        className="w-80 h-100 object-contain rounded-xl drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
      />
    </div>
  );
}

// Icono compacto para la esquina superior del Menú / Header del Portal Familiar
export function IconoMenu() {
  return (
    <img 
      src="/imagenagua.png" 
      alt="Logo Menú Familiar" 
      className="w-45 h-15 object-contain rounded-md"
    />
  );
}

// ==========================================
// ⚪ VARIANTES PARA ENCARGADO Y TESORERO (Imagen Administrativa / Blanca)
// ==========================================

// Escudo Operativo para los layouts o portales administrativos de control
export function EscudoAdmin() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {/* Llamamos a tu nueva imagen blanca desde la carpeta public */}
      <img 
        src="/imagenaguan.png" 
        alt="Administración DERCAS" 
        className="w-80 h-100 object-contain rounded-xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
      />
    </div>
  );
}

// Icono compacto blanco para la esquina superior del Menú Lateral (Sidebar Administrativo)
export function IconoMenuAdmin() {
  return (
    <img 
      src="/imagenaguan.png" 
      alt="Logo Menú Administrativo" 
      className="w-45 h-15 object-contain rounded-md"
    />
  );
}