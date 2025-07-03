import { FaUserPlus, FaBullhorn, FaSearch, FaHandshake, FaSmile, FaCheckCircle, FaComments } from "react-icons/fa";
import { ReactNode } from "react";

type EtapeProps = {
  num: string | number;
  icon: ReactNode;
  title: string;
  text: string;
};

const Etape = ({ num, icon, title, text }: EtapeProps) => (
    <div className="flex flex-col items-center text-center px-4 py-6 rounded-lg bg-white shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] w-full md:w-[260px]">
      <div className="text-[#1a6350] text-4xl font-bold mb-2">{num}</div>
      <div className="text-3xl text-[#1a6350] mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#142D2D]">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
);

const CommentCaMarche = () => {
  return (
    <div className="bg-[#f7faf9] text-[#142D2D]">
      {/* HERO */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#1a6350]/10 w-full gap-10 px-10 py-20">
        <div className="w-full md:w-1/2 px-10">
          <h1 className="text-4xl font-bold mb-6 leading-snug">Comment ça marche ?</h1>
          <p className="mb-6 text-gray-700 leading-relaxed">
            Bienvenue chez <strong>EcoDeli</strong>, la plateforme de crowdshipping qui connecte les besoins de chacun avec la communauté !
          </p>
          <button className="bg-[#1a6350] text-white px-6 py-3 rounded-lg hover:bg-[#144f40] transition duration-300">
            Découvrir
          </button>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="../assets/image/greybg.jpg"
            className="max-w-[300px] rounded-xl shadow-lg"
            alt="Illustration"
          />
        </div>
      </section>

      {/* SECTION CLIENT */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">Vous avez besoin d'un service ?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <Etape
            num="1"
            icon={<FaUserPlus />}
            title="Créez votre compte"
            text="Inscrivez-vous gratuitement et décrivez vos besoins."
          />
          <Etape
            num="2"
            icon={<FaBullhorn />}
            title="Déposez une annonce"
            text="Choisissez le type de service : livraison, courses, garde d'animaux, etc."
          />
          <Etape
            num="3"
            icon={<FaSearch />}
            title="Consultez les propositions"
            text="Découvrez les offres des membres qui peuvent vous aider."
          />
          <Etape
            num="4"
            icon={<FaHandshake />}
            title="Choisissez le prestataire"
            text="Comparez les profils, les évaluations et les prix."
          />
          <Etape
            num="5"
            icon={<FaComments />}
            title="Organisez les détails"
            text="Discutez via la messagerie sécurisée."
          />
          <Etape
            num="6"
            icon={<FaSmile />}
            title="Profitez du service"
            text="Recevez l’aide ou la livraison directement."
          />
          <Etape
            num="7"
            icon={<FaCheckCircle />}
            title="Payez & Évaluez"
            text="Paiement sécurisé. Donnez votre avis."
          />
        </div>
      </section>

      {/* SECTION PRESTATAIRE */}
      <section className="bg-[#1a6350]/5 px-6 md:px-20 py-16">
        <h2 className="text-3xl font-semibold mb-10 text-center">Vous souhaitez proposer vos services ?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <Etape
            num="1"
            icon={<FaUserPlus />}
            title="Inscrivez-vous"
            text="Créez un compte prestataire et définissez vos compétences."
          />
          <Etape
            num="2"
            icon={<FaSearch />}
            title="Trouvez des annonces"
            text="Repérez les missions près de chez vous ou sur vos trajets."
          />
          <Etape
            num="3"
            icon={<FaBullhorn />}
            title="Proposez vos services"
            text="Indiquez vos prix et vos disponibilités."
          />
          <Etape
            num="4"
            icon={<FaHandshake />}
            title="Acceptez & Discutez"
            text="Gérez les missions et échangez avec le client."
          />
          <Etape
            num="5"
            icon={<FaSmile />}
            title="Effectuez la mission"
            text="Réalisez-la avec soin et professionnalisme."
          />
          <Etape
            num="6"
            icon={<FaCheckCircle />}
            title="Recevez votre paiement"
            text="Une fois validé par le client, l'argent est à vous !"
          />
        </div>
      </section>

      {/* AUTRES BLOCS */}
      <section className="px-6 md:px-20 py-12 space-y-10">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-[#1a6350]">🔒 La sécurité sur EcoDeli</h3>
          <p className="text-gray-600">Vérifications, messagerie sécurisée, évaluations et assurance pour vos services.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-[#1a6350]">🌱 Notre impact social & environnemental</h3>
          <p className="text-gray-600">EcoDeli favorise l'entraide locale tout en limitant l’empreinte carbone.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2 text-[#1a6350]">🛍️ Devenir commerçant partenaire</h3>
          <p className="text-gray-600">Proposez la livraison de vos produits grâce à notre service "Lâcher de Chariot".</p>
        </div>
      </section>
    </div>
  );
};

export default CommentCaMarche;
