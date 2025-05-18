import heroImg from "../assets/Image_acceuil.png";

const HeroSection = () => {
  return (
    <section className="w-full px-8 py-38 flex flex-col lg:flex-row items-center justify-between gap-12 bg-white">
      <div className="text-center lg:text-left max-w-xl lg:pl-50">
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
          <span className="whitespace-nowrap">
            Le{" "}
            <span className="font-semibold text-[#1a6350]">crowdshipping</span>,
          </span>
          <br />
          simple,
          <br />
          économique,
          <br />
          solidaire.
        </h1>
        <button className="mt-8 px-6 py-3 bg-[#1a6350] text-white rounded-lg shadow-md hover:bg-[#155c47] transition">
          Commencez
        </button>
      </div>

      <div className="max-w-lg w-full  pr-8 lg:pr-20">
        <img
          src={heroImg}
          alt="Illustration Ecodeli"
          className="w-full h-auto rounded-xl object-contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;
