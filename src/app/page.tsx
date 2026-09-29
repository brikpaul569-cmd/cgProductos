// app/page.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { PRODUCTS } from "@/lib/catalog";

// Importaciones de tus componentes de contenido
import Cases from "@/components/ui/Cases";
import About from "@/components/ui/About";

export default function HomePage() {
  const addItem = useCartStore((s) => s.addItem);
  const [toast, setToast] = useState<string | null>(null);

  const products = PRODUCTS;

  function handleAdd(p: (typeof products)[number]) {
    addItem({ id: p.id, name: p.name, priceUSD: p.priceUSD, priceCOP: p.priceCOP, image: p.image });
    setToast("Agregado al carrito");
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <div className="min-h-screen">
      {/* Sección Hero - Inspirada en Tropeaka */}
      <section className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-white"
               style={{ backgroundImage: "url('/images/ejemplo.webp')" }}> {/* Reemplaza con tu imagen de fondo */}
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay oscuro */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Nutrición Pura para una Vida Vibrante
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Descubre el poder de nuestros suplementos naturales para tu bienestar diario.
          </p>
          <a href="#productos" className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors shadow-lg">
            Explora Productos
          </a>
        </div>
      </section>

      {/* Sección de Productos en Grid - Estilo más refinado */}
      <section id="productos" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Nuestros Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {products.map((p) => (
              <div key={p.id} className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                {/* eslint-disable-next-line @next/next/no-img-element -- sizing is driven by existing Tailwind classes; converting to next/image would change layout */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-48 h-64 object-contain mb-4 drop-shadow-xl transition-transform hover:scale-105"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-lg font-semibold text-gray-700 mb-4">
                    {p.priceUSD} USD / {p.priceCOP.toLocaleString("es-CO")} COP
                </p>
                <button
                  onClick={() => handleAdd(p)}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" /> Añadir al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Detalles de Producto - Más espaciosa y visual */}
      <section id="detalles" className="py-20 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 space-y-24 md:space-y-32">
          {products.map((p, i) => (
            <div key={p.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-16 ${
                i % 2 === 0 ? "" : "md:flex-row-reverse"
              }`}
            >
              {/* Imagen grande */}
              <div className="w-full md:w-1/2 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- sizing is driven by existing Tailwind classes; converting to next/image would change layout */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full max-w-md h-auto object-contain drop-shadow-xl rounded-lg"
                />
              </div>

              {/* Texto */}
              <div className="w-full md:w-1/2 text-center md:text-left p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{p.name}</h3>
                <p className="text-xl font-medium text-gray-600 mb-6">{p.weight}</p>
                <p className="text-gray-700 text-lg leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ Referenciar las nuevas secciones */}
      <Cases />
      <About />

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}