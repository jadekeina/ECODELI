const advantages = [
  {
    title: "Réduction de l’impact environnemental",
    text: "En optimisant les trajets déjà prévus par les particuliers, le crowdshipping limite le nombre de véhicules dédiés à la livraison, réduisant ainsi les émissions de CO₂ et la congestion routière.",
    image: "/src/assets/Image/ReduireImpact.png",
  },
  {
    title: "Économie pour tous",
    text: "Les expéditeurs bénéficient de tarifs souvent plus avantageux que les solutions classiques, et les livreurs occasionnels arrondissent leurs fins de mois en rentabilisant leurs trajets.",
    image: "/src/assets/Image/economie.png",
  },
  {
    title: "Accès facilité à des produits introuvables localement",
    text: "Les particuliers peuvent se faire livrer des produits qui ne se trouvent pas dans leur région, grâce à des voyageurs qui acceptent de les acheminer lors de leurs déplacements.",
    image: "/src/assets/Image/ProduitLocale.png",
  },
];

const AdvantagesSection = () => {
  return (
    <section className=" py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-25 justify-center items-center">
        {advantages.map((adv, i) => (
          <div key={i}>
            <div className="flex justify-center items-center">
              <img
                src={adv.image}
                alt={adv.title}
                className="h-55 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-md font-semibold text-[#1a6350] mb-2">
                {adv.title}
              </h3>
              <p className="text-sm text-gray-700">{adv.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantagesSection;
