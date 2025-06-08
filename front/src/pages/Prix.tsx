import "./Prix.css";

const Prix = () => {
  return (
      <>
        {/* Bloc de Titre */}
        <div className="flex flex-col items-center justify-center ">
          <div className="flex flex-col items-center justify-center bg-[#1a6350]/10 w-full py-38 ">
            <h1 className="text-4xl md:text-5xl font-light text-[#142D2D] leading-tight font-semibold">
              Plusieurs types d'entrepreneurs,
            </h1>
            <h1 className="text-4xl md:text-5xl font-light text-[#142D2D] leading-tight font-semibold bg-[#54B89A]/40">
              plusieurs versions d'Ecodeli
            </h1>

            {/* Bloc de Switch */}
            <div className="switch-container mt-3 relative">
              <input className="toggle-checkbox" id="toggle-switch" type="checkbox" />
              <label className="switch" htmlFor="toggle-switch">
                <div className="toggle">
                  <div className="led"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Bloc de Prix */}
          <div className="flex space-between gap-15 justify-center items-center absolute top-[55%]">
            {[1, 2, 3].map((_, index) => (
                <div
                    key={index}
                    className="bg-[#155250] w-[18em] h-[35em] rounded-md flex flex-col items-center"
                >
                  {/* Haut du bloc */}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-white text-3xl font-bold mt-10">Basique</h3>
                    <h3 className="text-white text-2xl font-bold bg-[#54B89A] w-[105px] rounded-sm text-center mt-5">
                      Gratuit
                    </h3>
                    <p className="text-white/50 text-sm mt-5 text-center px-3">
                      100% gratuit, sans engagement, sans carte bancaire
                    </p>
                    <button className="text-[#54B89A] bg-white w-[105px] h-[30px] text-md text-center rounded-sm mt-5">
                      Je m'inscris
                    </button>
                  </div>

                  {/* Bas du bloc */}
                  <div className="flex flex-col items-center bg-white w-full h-full mt-3 shadow-md hover:shadow-lg transition-all duration-300">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-5 items-center justify-center mt-5"
                        >
                          <img
                              className="w-[13px] h-[13px] self-center"
                              src="/icons/check-solid.svg"
                              alt="check icon"
                          />
                          <p className="text-xs">blablabla</p>
                        </div>
                    ))}
                  </div>
                </div>
            ))}
          </div>

          {/* Espace blanc visuel */}
          <div className="bg-[#ffffff] w-[15em] h-[35em]"></div>

          {/* Bloc final avec fond rond et image */}
          <div className="bg-[#54B89A]/80 w-full h-[30em] flex items-center justify-center overflow-hidden">
            <div className="flex w-[90%] max-w-6xl justify-between items-center">
              {/* Texte */}
              <div className="flex flex-col items-start text-left gap-3 w-1/2 px-10">
                <h1 className="text-4xl md:text-4xl font-bold text-[#ffffff] leading-tight font-semibold">
                  Rejoignez la communauté et gagnez du temps avec Ecodeli.
                </h1>
                <p className="text-white/90 text-sm mt-5 text-left">
                  Inscrivez-vous gratuitement sur Ecodeli et profitez de différents
                  types de services.
                </p>
                <button className="bg-white text-[#54B89A] px-4 py-2 rounded font-semibold">
                  Je m'inscris
                </button>
              </div>

              {/* Image */}
              <div className="relative w-1/2 flex justify-center overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-[#155250]/50 rounded-full z-0 top-25"></div>
                <div className="absolute w-[400px] h-[400px] bg-[#ffffff]/60 rounded-full z-0 top-35"></div>
                <img
                    src="/images/girl1.png"
                    alt="girl"
                    className="relative z-5 w-[90%] transform scale-110 translate-y-[-5%]"
                />
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Prix;
