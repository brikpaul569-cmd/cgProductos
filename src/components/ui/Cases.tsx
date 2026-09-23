// components/ui/Cases.tsx
const Cases = () => {
  return (
    <section id="casos-exito" className="container mx-auto py-16 px-6 md:px-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Casos de Éxito
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Aquí puedes agregar testimonios, imágenes o videos de casos de éxito */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic">&quot;Los productos de CG cambiaron mi rutina de salud. ¡Estoy encantada con los resultados!&quot;</p>
          <p className="mt-4 text-sm font-semibold text-right text-green-600">- Ana G.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic">&quot;Una solución natural y efectiva para mis necesidades. La diferencia es notable desde el primer mes.&quot;</p>
          <p className="mt-4 text-sm font-semibold text-right text-green-600">- Carlos R.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-700 italic">&quot;Increíble la calidad de sus productos. El envío fue rápido y la atención excelente.&quot;</p>
          <p className="mt-4 text-sm font-semibold text-right text-green-600">- Sofía M.</p>
        </div>
      </div>
    </section>
  );
};

export default Cases;