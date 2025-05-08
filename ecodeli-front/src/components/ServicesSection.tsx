const services = [
  { title: "Livraisons de colis", image: "src/assets/Livraison.png" },
  { title: "Service à la personne", image: "src/assets/ServicePersonne.png" },
  { title: "Courses", image: "src/assets/Courses.png" },
  { title: "Ménage", image: "src/assets/Menage.png" },
  { title: "Garde d'enfants", image: "src/assets/GardeEnfants.png" },
  { title: "Garde d’animaux", image: "src/assets/GardeAnimaux.png" },
];

const ServicesSection = () => {
    return (
      <section className="bg-[#ffffff] py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div
              key={i}
              className="bg-[#55c3aa] rounded-xl p-4 flex flex-col justify-between text-white h-64 relative"
            >
              {/* Texte en haut à gauche */}
              <div className="absolute top-4 left-4 z-10">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                
              </div>
  
              {/* Image plus grande en bas */}
            <div className="flex flex-grow items-center justify-center mt-0">
                <img
                    src={s.image}
                    alt={s.title}
                    className="h-60 object-contain"
                />
            </div>

            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default ServicesSection;