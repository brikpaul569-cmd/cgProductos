// components/ui/CountrySelector.tsx
"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

const COUNTRIES_LIST = [
  "United States",
  "Panamá",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "República Dominicana",
  "Colombia",
] as const;

export default function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const setCountry = useCartStore((s) => s.setCountry);

  // Muestra el modal al cargar la página si no hay un país guardado
  useEffect(() => {
    // Comprueba si hay un país guardado en el LocalStorage
    const savedCountry = localStorage.getItem("user-country");
    if (!savedCountry) {
      setIsOpen(true);
    }
  }, []); // El array vacío asegura que este efecto se ejecute una sola vez al cargar el componente

  const handleSelectCountry = (selectedCountry: (typeof COUNTRIES_LIST)[number]) => {
    setCountry(selectedCountry);
    // Guarda el país seleccionado para que el modal no vuelva a salir
    localStorage.setItem("user-country", selectedCountry);
    setIsOpen(false);
  };

  if (!isOpen) {
    return null; // No renderiza nada si el modal está cerrado
  }

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-white">
      <div className="bg-white p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Selecciona tu Región</h2>
        <div className="flex flex-col space-y-2">
          {COUNTRIES_LIST.map((c) => (
            <button
              key={c}
              onClick={() => handleSelectCountry(c)}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}