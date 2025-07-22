import { useEffect, useRef, useState, useContext } from "react";
import API_URL from "@/config";
import { UserContext } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Trajet = () => {
  const [center] = useState({ lat: 48.8049, lng: 2.1204 });
  const [depart, setDepart] = useState("");
  const [arrivee, setArrivee] = useState("");
  const [distance, setDistance] = useState("");
  const [duree, setDuree] = useState("");
  const [prixEstime, setPrixEstime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [erreurHeure, setErreurHeure] = useState("");
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const departInputRef = useRef<HTMLInputElement>(null);
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const departMarker = useRef<google.maps.Marker | null>(null);
  const arriveeMarker = useRef<google.maps.Marker | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const polylineShadowRef = useRef<google.maps.Polyline | null>(null);

  const { user, loading } = useContext(UserContext);
  const token = user?.token || localStorage.getItem("token");
  const { t } = useTranslation();

  const navigate = useNavigate();

  const handleCommander = async () => {
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

      // Paiement après création
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

  const calculateDistanceAndDuration = (
    origin: google.maps.LatLng,
    destination: google.maps.LatLng,
  ) => {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (
          status === "OK" &&
          response &&
          response.rows[0].elements[0].status === "OK"
        ) {
          const distanceText = response.rows[0].elements[0].distance.text;
          const dureeText = response.rows[0].elements[0].duration.text;
          const parsedKm = parseFloat(
            distanceText.replace(" km", "").replace(",", "."),
          );

          console.log("📏 Google Distance Text:", distanceText);
          console.log("🔢 Distance km (float):", parsedKm);

          if (!isNaN(parsedKm)) {
            setDistance(distanceText);
            setDuree(dureeText);
            setDistanceKm(parsedKm);

            const base = 4;
            const tarif = parsedKm * 1.25;
            const commission = 3;
            const sousTotal = base + tarif + commission;
            const tva = 0.2 * sousTotal;
            const prix = sousTotal + tva;
            setPrixEstime(prix.toFixed(2));
          } else {
            setDistance("Distance inconnue");
            setDuree("Durée inconnue");
            setPrixEstime("");
            setDistanceKm(null);
          }
        } else {
          setDistance("Distance inconnue");
          setDuree("Durée inconnue");
          setPrixEstime("");
          setDistanceKm(null);
        }
      },
    );
  };

  const updatePolyline = () => {
    if (!mapInstance.current || !departMarker.current || !arriveeMarker.current)
      return;

    const start = departMarker.current.getPosition();
    const end = arriveeMarker.current.getPosition();
    if (!start || !end) return;

    polylineRef.current?.setMap(null);
    polylineShadowRef.current?.setMap(null);

    polylineShadowRef.current = new google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: "#000000",
      strokeOpacity: 0.2,
      strokeWeight: 10,
      zIndex: 0,
      map: mapInstance.current,
    });

    polylineRef.current = new google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: "#ffffff",
      strokeOpacity: 0.9,
      strokeWeight: 5,
      zIndex: 1,
      map: mapInstance.current,
    });
  };

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: 12,
    });

    const options = {
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address", "geometry"],
      types: ["geocode"],
    };

    if (departInputRef.current) {
      const autocompleteDepart = new google.maps.places.Autocomplete(
        departInputRef.current,
        options,
      );
      autocompleteDepart.addListener("place_changed", () => {
        const place = autocompleteDepart.getPlace();
        if (place.geometry?.location) {
          const location = place.geometry.location;
          setDepart(place.formatted_address || "");
          mapInstance.current?.panTo(location);
          if (!departMarker.current) {
            departMarker.current = new google.maps.Marker({
              map: mapInstance.current,
            });
          }
          departMarker.current.setPosition(location);
          updatePolyline();
          if (
            departMarker.current.getPosition() &&
            arriveeMarker.current?.getPosition()
          ) {
            calculateDistanceAndDuration(
              departMarker.current.getPosition()!,
              arriveeMarker.current.getPosition()!,
            );
          }
        }
      });
    }

    if (arriveeInputRef.current) {
      const autocompleteArrivee = new google.maps.places.Autocomplete(
        arriveeInputRef.current,
        options,
      );
      autocompleteArrivee.addListener("place_changed", () => {
        const place = autocompleteArrivee.getPlace();
        if (place.geometry?.location) {
          const location = place.geometry.location;
          setArrivee(place.formatted_address || "");
          if (!arriveeMarker.current) {
            arriveeMarker.current = new google.maps.Marker({
              map: mapInstance.current,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              },
            });
          }
          arriveeMarker.current.setPosition(location);
          updatePolyline();
          if (
            departMarker.current?.getPosition() &&
            arriveeMarker.current?.getPosition()
          ) {
            calculateDistanceAndDuration(
              departMarker.current.getPosition()!,
              arriveeMarker.current.getPosition()!,
            );
          }
        }
      });
    }
  }, []);

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full">
      <div className="w-full md:w-1/3 p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">{t("ride.plan_trip")}</h2>

        <input
          ref={departInputRef}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder={t("ride.departure_address")}
          value={depart}
          onChange={(e) => setDepart(e.target.value)}
        />

        <input
          ref={arriveeInputRef}
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder={t("ride.arrival_address")}
          value={arrivee}
          onChange={(e) => setArrivee(e.target.value)}
        />

        {distance && (
          <p className="text-sm text-gray-700 mt-2">📍 {t("ride.distance")}: {distance}</p>
        )}
        {duree && (
          <p className="text-sm text-gray-700">⏱️ {t("ride.estimated_duration")}: {duree}</p>
        )}
        {prixEstime && (
          <p className="text-sm text-gray-700">
            💰 {t("ride.estimated_price")}: {prixEstime} € (incl. commission + TVA)
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">📅 {t("ride.desired_date")}</label>
          <input
            type="date"
            min={todayDate}
            className="w-full border border-gray-300 rounded p-2"
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

          <label className="text-sm font-medium">🕒 {t("ride.desired_time")}</label>
          <input
            type="time"
            className="w-full border border-gray-300 rounded p-2"
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
            <p className="text-sm text-red-500 italic">{erreurHeure}</p>
          )}

          <label className="text-sm font-medium">
            📝 {t("ride.note_for_driver")}
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 min-h-[80px]"
            placeholder={t("ride.note_placeholder")}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          />
        </div>

        <button
          onClick={handleCommander}
          disabled={loading}
          className={`w-full mt-4 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white py-2 rounded text-sm font-medium`}
        >
          {t("ride.order")}
        </button>

        <p className="text-xs text-gray-500 italic pt-1">
          {t("ride.stripe_payment_info")}
        </p>
      </div>

      <div className="w-full md:w-2/3 h-[400px] md:h-full">
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
};

export default Trajet;
