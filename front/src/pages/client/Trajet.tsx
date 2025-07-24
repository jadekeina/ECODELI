import { useEffect, useRef, useState, useContext } from "react";
import API_URL from "@/config";
import { UserContext } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Trajet = () => {
  const [center] = useState({ lat: 48.8049, lng: 2.1204 }); // Centre initial de la carte
  const [depart, setDepart] = useState(""); // Adresse de départ (string)
  const [arrivee, setArrivee] = useState(""); // Adresse d'arrivée (string)
  const [distance, setDistance] = useState(""); // Distance affichée (ex: "10 km")
  const [duree, setDuree] = useState(""); // Durée affichée (ex: "20 mins")
  const [prixEstime, setPrixEstime] = useState(""); // Prix estimé
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Date et heure du trajet
  const [commentaire, setCommentaire] = useState(""); // Commentaire pour le chauffeur
  const [erreurHeure, setErreurHeure] = useState(""); // Message d'erreur pour l'heure
  const [distanceKm, setDistanceKm] = useState<number | null>(null); // Distance en km (numérique)

  // Références pour les éléments de la carte et les services Google Maps
  const mapRef = useRef<HTMLDivElement>(null); // Référence à l'élément DOM de la carte
  const departInputRef = useRef<HTMLInputElement>(null); // Référence à l'input de l'adresse de départ
  const arriveeInputRef = useRef<HTMLInputElement>(null); // Référence à l'input de l'adresse d'arrivée
  const mapInstance = useRef<google.maps.Map | null>(null); // Instance de la carte Google Maps

  // NOUVELLES RÉFÉRENCES pour les services de directions
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  const { user, loading } = useContext(UserContext); // Contexte utilisateur
  const token = user?.token || localStorage.getItem("token"); // Token d'authentification
  const { t } = useTranslation(); // Hook de traduction

  const navigate = useNavigate(); // Hook de navigation

  /**
   * Gère la commande du trajet.
   * Valide les champs, envoie les données au backend et gère le paiement.
   */
  const handleCommander = async () => {
    // Validation des champs
    if (!depart || !arrivee || !selectedDate || !prixEstime) {
      alert(t("ride.fill_all"));
      return;
    }

    if (!token) {
      alert(t("ride.not_authenticated"));
      return;
    }

    if (!distanceKm || isNaN(distanceKm)) {
      alert(t("ride.invalid_distance"));
      return;
    }

    try {
      // Envoi des données du trajet au backend
      const response = await fetch(`${API_URL}/rides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user?.id,
          depart_address: depart,
          arrivee_address: arrivee,
          distance_km: distanceKm,
          duree,
          scheduled_at: selectedDate.toISOString(),
          note: commentaire,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Réponse backend :", data);
        throw new Error(data.message || "Erreur lors de la commande");
      }

      const rideId = data.ride?.ride_id;
      console.log("🎯 ID reçu du backend :", rideId);
      console.log("🧾 Réponse complète backend :", data);

      if (!rideId) {
        throw new Error("Identifiant de course manquant.");
      }

      console.log("🎯 ID ride créé :", rideId);

      // Paiement après création (si nécessaire)
      const paymentResponse = await fetch(`${API_URL}/rides/${rideId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.message || "Erreur lors du paiement");
      }

      // ✅ Redirection uniquement si tout est OK
      navigate("/confirmation-trajet", { state: { rideId } });
    } catch (err) {
      console.error("❌ Erreur commande :", err);
      alert(t("ride.order_error"));
    }
  };

  /**
   * Calcule la distance et la durée entre deux adresses et affiche l'itinéraire sur la carte.
   * @param originAddress L'adresse de départ (string).
   * @param destinationAddress L'adresse d'arrivée (string).
   */
  const calculateAndRenderRoute = (
      originAddress: string,
      destinationAddress: string,
  ) => {
    if (!directionsServiceRef.current || !directionsRendererRef.current) return;

    // Requête pour les directions
    directionsServiceRef.current.route(
        {
          origin: originAddress,
          destination: destinationAddress,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK" && response) {
            // Affiche l'itinéraire sur la carte
            directionsRendererRef.current?.setDirections(response);

            // Extrait les informations de distance et durée de la première étape du premier itinéraire
            const route = response.routes[0];
            const leg = route.legs[0]; // La première et seule étape pour un itinéraire simple

            const distanceText = leg.distance?.text || "Distance inconnue";
            const dureeText = leg.duration?.text || "Durée inconnue";
            const parsedKm = parseFloat(
                (leg.distance?.text || "").replace(" km", "").replace(",", "."),
            );

            console.log("📏 Google Distance Text:", distanceText);
            console.log("🔢 Distance km (float):", parsedKm);

            if (!isNaN(parsedKm)) {
              setDistance(distanceText);
              setDuree(dureeText);
              setDistanceKm(parsedKm);

              // Calcul du prix estimé
              const base = 4;
              const tarif = parsedKm * 1.25;
              const commission = 3;
              const sousTotal = base + tarif + commission;
              const tva = 0.2 * sousTotal;
              const prix = sousTotal + tva;
              setPrixEstime(prix.toFixed(2));
            } else {
              // Réinitialisation si la distance n'est pas un nombre valide
              setDistance("Distance inconnue");
              setDuree("Durée inconnue");
              setPrixEstime("");
              setDistanceKm(null);
            }
          } else {
            // Gère les erreurs du service de directions
            console.error("Directions request failed due to " + status);
            setDistance("Distance inconnue");
            setDuree("Durée inconnue");
            setPrixEstime("");
            setDistanceKm(null);
            directionsRendererRef.current?.setDirections({ routes: [] }); // Efface l'itinéraire
          }
        },
    );
  };

  /**
   * Initialise la carte Google Maps et les services d'autocomplétion/directions.
   */
  useEffect(() => {
    // Vérifie si l'API Google Maps est chargée et si l'élément de carte est disponible
    if (!window.google || !mapRef.current) return;

    // Initialise la carte
    mapInstance.current = new google.maps.Map(mapRef.current, {
      center, // Centre initial de la carte
      zoom: 12, // Niveau de zoom initial
      disableDefaultUI: true, // Désactive les contrôles par défaut pour une UI personnalisée
    });

    // Initialise les services de directions
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: mapInstance.current, // Lie le renderer à l'instance de la carte
      polylineOptions: {
        strokeColor: "#155250", // Couleur du tracé de l'itinéraire
        strokeOpacity: 0.8,
        strokeWeight: 6,
      },
      suppressMarkers: false, // Laisse Google Maps afficher les marqueurs A et B
    });

    // Options pour l'autocomplétion des adresses
    const autocompleteOptions = {
      componentRestrictions: { country: "fr" }, // Restreint aux adresses en France
      fields: ["formatted_address", "geometry"], // Champs à récupérer
      types: ["geocode"], // Type de recherche (adresses géocodées)
    };

    // Initialisation de l'autocomplétion pour l'adresse de départ
    if (departInputRef.current) {
      const autocompleteDepart = new google.maps.places.Autocomplete(
          departInputRef.current,
          autocompleteOptions,
      );
      autocompleteDepart.addListener("place_changed", () => {
        const place = autocompleteDepart.getPlace();
        if (place.formatted_address) {
          setDepart(place.formatted_address); // Met à jour l'état de l'adresse de départ

          // Si les deux adresses sont renseignées, calcule et affiche l'itinéraire
          if (depart && arrivee) {
            calculateAndRenderRoute(place.formatted_address, arrivee);
          } else if (arrivee) { // Si seule l'arrivée est déjà là, utilise la nouvelle adresse de départ
            calculateAndRenderRoute(place.formatted_address, arrivee);
          } else { // Si seulement le départ est renseigné, centre la carte sur le départ
            mapInstance.current?.panTo(place.geometry?.location || center);
          }
        }
      });
    }

    // Initialisation de l'autocomplétion pour l'adresse d'arrivée
    if (arriveeInputRef.current) {
      const autocompleteArrivee = new google.maps.places.Autocomplete(
          arriveeInputRef.current,
          autocompleteOptions,
      );
      autocompleteArrivee.addListener("place_changed", () => {
        const place = autocompleteArrivee.getPlace();
        if (place.formatted_address) {
          setArrivee(place.formatted_address); // Met à jour l'état de l'adresse d'arrivée

          // Si les deux adresses sont renseignées, calcule et affiche l'itinéraire
          if (depart && arrivee) {
            calculateAndRenderRoute(depart, place.formatted_address);
          } else if (depart) { // Si seul le départ est déjà là, utilise la nouvelle adresse d'arrivée
            calculateAndRenderRoute(depart, place.formatted_address);
          } else { // Si seulement l'arrivée est renseignée, centre la carte sur l'arrivée
            mapInstance.current?.panTo(place.geometry?.location || center);
          }
        }
      });
    }
  }, [center, depart, arrivee]); // Dépendances pour re-exécuter l'effet si le centre ou les adresses changent

  // Date du jour pour la validation de la date
  const todayDate = new Date().toISOString().split("T")[0];

  return (
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full font-outfit-regular">
        {/* Section du formulaire de planification de trajet */}
        <div className="w-full md:w-1/3 p-6 space-y-4 bg-white shadow-lg rounded-xl md:rounded-r-none md:rounded-l-xl overflow-y-auto">
          <h2 className="text-2xl font-outfit-bold mb-4 text-[#142D2D]">{t("ride.plan_trip")}</h2>

          {/* Champs de saisie des adresses */}
          <input
              ref={departInputRef}
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#155250] focus:border-transparent transition duration-200"
              placeholder={t("ride.departure_address")}
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
          />

          <input
              ref={arriveeInputRef}
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#155250] focus:border-transparent transition duration-200"
              placeholder={t("ride.arrival_address")}
              value={arrivee}
              onChange={(e) => setArrivee(e.target.value)}
          />

          {/* Affichage des informations de trajet (distance, durée, prix) */}
          {distance && (
              <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                <span className="text-[#155250]">📍</span> {t("ride.distance")}: {distance}
              </p>
          )}
          {duree && (
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-[#155250]">⏱️</span> {t("ride.estimated_duration")}: {duree}
              </p>
          )}
          {prixEstime && (
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="text-[#155250]">💰</span> {t("ride.estimated_price")}: {prixEstime} € (incl. commission + TVA)
              </p>
          )}

          {/* Section date et heure */}
          <div className="space-y-2 pt-4">
            <label className="text-sm font-medium text-[#142D2D] flex items-center gap-2">
              <span className="text-[#155250]">📅</span> {t("ride.desired_date")}
            </label>
            <input
                type="date"
                min={todayDate}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#155250] focus:border-transparent transition duration-200"
                value={selectedDate?.toISOString().split("T")[0] || ""}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  if (selectedDate)
                    newDate.setHours(
                        selectedDate.getHours(),
                        selectedDate.getMinutes(),
                    );
                  setSelectedDate(newDate);
                }}
            />

            <label className="text-sm font-medium text-[#142D2D] flex items-center gap-2">
              <span className="text-[#155250]">🕒</span> {t("ride.desired_time")}
            </label>
            <input
                type="time"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#155250] focus:border-transparent transition duration-200"
                value={selectedDate ? selectedDate.toTimeString().slice(0, 5) : ""}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":").map(Number);
                  const newDate = selectedDate || new Date();
                  newDate.setHours(hours, minutes);
                  const now = new Date();
                  if (newDate < now) {
                    setErreurHeure(t("ride.future_datetime"));
                    return;
                  }
                  setErreurHeure("");
                  setSelectedDate(new Date(newDate));
                }}
            />
            {erreurHeure && (
                <p className="text-sm text-red-500 italic mt-1">{erreurHeure}</p>
            )}

            {/* Champ de commentaire */}
            <label className="text-sm font-medium text-[#142D2D] flex items-center gap-2">
              <span className="text-[#155250]">📝</span> {t("ride.note_for_driver")}
            </label>
            <textarea
                className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-[#155250] focus:border-transparent transition duration-200"
                placeholder={t("ride.note_placeholder")}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
            />
          </div>

          {/* Bouton de commande */}
          <button
              onClick={handleCommander}
              disabled={loading}
              className={`w-full mt-6 py-3 rounded-lg text-white text-lg font-medium transition duration-300 shadow-md
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#155250] hover:bg-[#142D2D]"}
          `}
          >
            {t("ride.order")}
          </button>

          <p className="text-xs text-gray-500 italic pt-2 text-center">
            {t("ride.stripe_payment_info")}
          </p>
        </div>

        {/* Section de la carte Google Maps */}
        <div className="w-full md:w-2/3 h-[400px] md:h-full relative overflow-hidden rounded-xl md:rounded-l-none md:rounded-r-xl shadow-lg">
          <div ref={mapRef} className="h-full w-full" />
        </div>
      </div>
  );
};

export default Trajet;
