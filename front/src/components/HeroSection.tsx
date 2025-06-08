import { Link } from "react-router-dom";
import "./HeroSection.css";
import "../styles/fonts.css";

const HeroSection = () => {
  return (
    <section className="w-full px-8 py-8 flex flex-col lg:flex-row items-center justify-between gap-12  ">
      <div className="text-center lg:text-left max-w-xl lg:pl-50">
        <h1 className="text-4xl md:text-5xl font-light text-[#142D2D] leading-tight font-outfit-regular">
          <span className="whitespace-nowrap">
            Le{" "}
            <span className="font-outfit-semibold text-[#155250]">crowdshipping</span>,
          </span>
          <br />
          simple,
          <br />
          économique,
          <br />
          solidaire.
        </h1>

        <Link to="/inscription">
                <button
          aria-label="User Login Button"
          role="button"
          className="user-profile mt-3 font-outfit-medium"
        >
          <div className="user-profile-inner ">
            <p>Créer un compte !</p>
          </div>
        </button>

        </Link>
  
         

      </div>

      <div className="max-w-lg w-full  pr-30 lg:pr-20">

     
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Personne 1 */}
        <div className="relative">
          <div className="w-[220px] h-[330px] bg-[#54B89A]/50 rounded-[60px]  shadow-md">
            <img
                src= "/filleverte.png"
              alt="Femme en vert"
              className="w-full h-full object-cover scale-155"
            />
          </div>

          {/* Facture */}
          <div className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-xl p-3 text-xs w-[130px]">
            <p className="font-bold mb-1">Facture</p>
            <div className="flex justify-between">
              <span>Maintenance</span>
              <span>100,00 €</span>
            </div>
            <hr className="my-1" />
            <div className="text-gray-500">
              <div className="flex justify-between">
                <span>TVA</span>
                <span>20,00 €</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>120,00 €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personne 2 et 3 (empilés) */}
        <div className="flex flex-col gap-6 relative">
          {/* Personne 2 */}
          <div className="relative">
            <div className="w-[200px] h-[280px] bg-white rounded-[60px] overflow-hidden shadow-md">
              <img
                src= "/mecchoqué.png"
                alt="Femme en bleu"
                className=" object-cover scale-155 translate-y-8"
              />
            </div>

            {/* Badge "Conforme" */}
            <div className="absolute top-3 right-3  text-xs font-bold px-2 py-1 rounded-full shadow text-[#155250] border border-[#155250]">
              Conforme <span className="text-black ml-1">Sécurisé</span>
            </div>
          </div>

          {/* Personne 3 */}
          <div className="relative">
            <div className="w-[200px] h-[280px] bg-[#91C684]/60 rounded-[60px] overflow-hidden shadow-md">
              <img
                src= "/groupevieux.png"
                alt="Homme"
                className="w-full h-full object-cover scale-155 translate-y-8"
              />
            </div>

            {/* Badge IA */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 text-xs font-semibold rounded-full shadow">
              ✨ IA
            </div>
          </div>
        </div>
      </div>
   
      </div>
    </section>
  );
};

export default HeroSection;
