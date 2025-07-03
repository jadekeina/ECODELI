import PortraitPro from "@/assets/image/PortraitPro.png"
import girl2 from "@/assets/image/girl2.jpg"

const NosEngagements = () => {
  return (
    <div className="">

      <div className="flex flex-col items-center justify-center bg-[#1a6350]/10 w-full  py-18"> 

      <div>
        <h1 className="text-4xl md:text-5xl font-light text-[#142D2D] leading-tight font-semibold">    
        Qui sommes nous ?
           </h1>
           </div>

           <div>
           <p className="font-light text-[#142D2D] leading-tight px-55 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam recusandae possimus repudiandae voluptates ducimus fugit quibusdam ipsa repellat, consectetur, ea quam cumque tenetur. Illum praesentium natus porro tenetur, eaque nam.</p>
           </div>

           <div className="mt-4  "><img src={PortraitPro} className="w-200  rounded-xl" alt="" /> </div>
      </div>


      <div className="flex flex-col items-center justify-center bg-[#ffffff] w-full py-8">



      <div className=" flex m-5 justify-center items-center px-40 ">
      <div> <img src="../assets/image/greybg.jpg" className="w-200 h-100 rounded-xl" alt="" /> </div>
      <div className="px-30"> <h2>lorem</h2> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam recusandae possimus repudiandae voluptates ducimus fugit quibusdam ipsa repellat, consectetur, ea quam cumque tenetur. Illum praesentium natus porro tenetur, eaque nam.</p></div>
      </div>


      <div className=" flex m-5 justify-center items-center px-40 ">
      <div className="px-30"> <h2>lorem</h2> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam recusandae possimus repudiandae voluptates ducimus fugit quibusdam ipsa repellat, consectetur, ea quam cumque tenetur. Illum praesentium natus porro tenetur, eaque nam.</p></div>
      <div> <img src="../assets/image/greybg.jpg" className="w-200 h-100 rounded-xl" alt="" /> </div>
      </div>


      <div></div>





      </div>

      <div className="flex flex-col items-center justify-center bg-[#155250] w-full py-38">
      </div>

      <div className="flex flex-col items-center justify-center bg-[#ffffff] w-full py-18">

      <section className="py-10 px-4 md:px-12 bg-white">
      {/* Bloc Valeurs */}
      <div className="text-center mb-16">
        <h4 className="text-sm font-semibold text-[#155250] uppercase mb-2">
          Nos valeurs
        </h4>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Ce qui nous anime
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
        {/* Carte 1 */}
        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <div className="text-blue-500 text-3xl mb-2">🔥</div>
          <h3 className="font-bold text-lg mb-2">Audace</h3>
          <p className="text-sm text-gray-600">
            Notre volonté de vous aider va au-delà des risques. Nous mettons un point
            d’honneur à nous dépasser au quotidien pour vous proposer le meilleur outil.
          </p>
        </div>

        {/* Carte 2 */}
        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <div className="text-blue-500 text-3xl mb-2">💚</div>
          <h3 className="font-bold text-lg mb-2">Bienveillance</h3>
          <p className="text-sm text-gray-600">
            Nos différences font notre force. En interne ou avec nos clients, nous nous
            adaptons à chaque besoin pour progresser et devenir partenaire de votre réussite.
          </p>
        </div>

        {/* Carte 3 */}
        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <div className="text-blue-500 text-3xl mb-2">⚡</div>
          <h3 className="font-bold text-lg mb-2">Performance</h3>
          <p className="text-sm text-gray-600">
            Nous avons la force d’avoir une équipe aux compétences multiples et unie
            par une même volonté : agir au service des entrepreneurs !
          </p>
        </div>
      </div>

      {/* Bloc Appel à l'action */}
      <div className="max-w-[65em] mx-auto bg-[#155250] text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Texte */}
        <div className="flex-1 text-left">
          <h2 className="text-4xl md:text-3xl font-bold mb-4">
            Envie de changer le monde avec nous ?
          </h2>
          <p className="mb-6">
            Vous souhaitez rejoindre l’aventure Ecodeli ? Partagez-nous votre candidature.
          </p>
          <button className="bg-white text-[#1E325F] px-6 py-2 rounded font-semibold hover:bg-gray-100 transition">
            Candidater
          </button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-end">
          <img
            src={girl2}
            alt="Femme qui travaille"
            className="rounded-xl w-[400px] h-auto object-cover"
          />
        </div>
      </div>
    </section>

      </div>


    </div>
  );
};

export default NosEngagements;
