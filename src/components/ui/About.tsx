// components/ui/About.tsx

const About = () => {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-12 bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto text-center">
      <h2
        id="about-heading"
        className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-6"
      >
        Acerca de Nosotros
      </h2>

      <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
        En <strong>CG Productos</strong> creamos suplementos alimenticios 100% libres de azúcar, formulados con ingredientes naturales y respaldados por evidencia científica. Nuestra misión es potenciar tu bienestar ofreciendo soluciones seguras, efectivas y con excelente sabor, diseñadas para personas con un estilo de vida consciente, activo y exigente.
      </p>

      <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
        Estamos comprometidos con la transparencia, la calidad y el respeto al medio ambiente. Cada producto es el resultado de una investigación minuciosa y controles de calidad rigurosos, pensado para brindarte beneficios reales sin sacrificar sabor ni los principios de una nutrición limpia.
      </p>
    </div>
  </div>
</section>

  );
};

export default About;
