import { useState } from "react";

const services = [
  { title: "Livraisons de colis", image: "src/assets/Image/greybg.jpg" },
  { title: "Service à la personne", image: "src/assets/Image/greybg.jpg" },
  { title: "Courses", image: "src/assets/Image/greybg.jpg" },
  { title: "Ménage", image: "src/assets/Image/greybg.jpg" },
  { title: "Garde d'enfants", image: "src/assets/Image/greybg.jpg" },
  { title: "Garde d’animaux", image: "src/assets/Image/greybg.jpg" },
];

const ServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3;

  const maxIndex = services.length - visibleCards;

  const goLeft = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goRight = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const visibleServices = services.slice(
    currentIndex,
    currentIndex + visibleCards,
  );

  return (
    <section className="bg-[#155250] py-18 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center relative">
        {/* Bouton gauche */}
        <button
          onClick={goLeft}
          className="absolute left-0 bg-white text-[#1a6350]  p-3 h-14 w-14  rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-30"
          disabled={currentIndex === 0}
        >
          <span className="text-xl">←</span>
        </button>

        <div className="flex items-center justify-center h-full mb-4">
          {" "}
          <h2 className="text-white text-4xl text-center">
            {" "}
            Toutes les <span className="bg-neutral-300/40 ">
              solutions
            </span>, <br /> pour chaque indépendant
          </h2>{" "}
        </div>

        <div className="flex gap-6 justify-center items-center">
          {visibleServices.map((s, i) => (
            <div
              key={i}
              className="bg-[#ffffff] rounded-xl p-1 text-white w-[300px] h-[400px] flex flex-col justify-between shadow-lg relative"
            >
              <div className="flex-grow flex items-center justify-center">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full rounded-xl "
                />
              </div>
              <h3 className="text-lg self-center font-semibold text-[#1a6350] ">
                {s.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Bouton droit */}
        <button
          onClick={goRight}
          className="absolute  right-0 bg-white text-[#1a6350] p-3 h-14 w-14 rounded-full shadow-md hover:bg-gray-100 transition disabled:opacity-30"
          disabled={currentIndex === maxIndex}
        >
          <span className="text-xl">→</span>
        </button>
      </div>
    </section>
  );
};

export default ServicesSection;
