import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

const Profil = () => {
  const { user, setUser } = useContext(UserContext);
  const realUser = user?.user || user;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstname: realUser?.firstname || "",
    lastname: realUser?.lastname || "",
    phone: realUser?.phone || "",
    birthday: realUser?.birthday || "",
    sexe: realUser?.sexe || "",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
    if (realUser?.profilpicture && !defaultPictures.includes(realUser.profilpicture)) {
      setPhoto(`http://localhost:3002${realUser.profilpicture}`);
    } else {
      setPhoto(null);
    }
  }, [realUser]);

  const getInitials = () => {
    if (!formData.firstname || !formData.lastname) return "??";
    return (
        formData.firstname.charAt(0).toUpperCase() +
        formData.lastname.charAt(0).toUpperCase()
    );
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhoto(previewUrl);
      setPhotoFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      firstname: realUser?.firstname || "",
      lastname: realUser?.lastname || "",
      phone: realUser?.phone || "",
      birthday: realUser?.birthday || "",
      sexe: realUser?.sexe || "",
    });
    setEditMode(false);
    setPhotoFile(null);
    if (realUser?.profilpicture) {
      setPhoto(`http://localhost:3002${realUser.profilpicture}`);
    } else {
      setPhoto(null);
    }
  };

  const handleDeletePhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous n'êtes pas connecté.");
      return;
    }
    
    if (!confirm("Voulez-vous vraiment supprimer votre photo de profil ?")) {
      return;
    }

    try {
      const { data: updatedUser } = await axios.delete(
        "http://localhost:3002/users/me/photo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(updatedUser); // Mettre à jour le contexte
      setPhoto(null); // Mettre à jour l'aperçu local
      setPhotoFile(null);
      alert("Photo de profil supprimée.");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue lors de la suppression de la photo.");
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    console.log("Token utilisé pour la requête :", token);
    if (!token) {
      alert("Vous n'êtes pas connecté.");
      return;
    }

    try {
      console.log("Données envoyées pour la mise à jour :", formData);
      await axios.patch(
        "http://localhost:3002/users/me",
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);

        const { data: updatedUser } = await axios.patch(
          "http://localhost:3002/users/me/photo",
          photoFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser(updatedUser);
      } else {
        if (user) {
          setUser({ ...user, ...formData });
        }
      }

      alert("Profil mis à jour avec succès !");
      setEditMode(false);
      setPhotoFile(null);

    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      alert("Une erreur est survenue");
    }
  };

  return (
      <div className="container  mx-auto min-h-screen px-4 py-8 flex flex-col items-center md:justify-start justify-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Profil</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative w-28 h-28">
            {photo ? (
                <img
                    src={photo}
                    className="w-28 h-28 rounded-full object-cover border border-gray-300"
                />
            ) : (
                <div className="w-28 h-28 rounded-full bg-[#E9FADF] text-[#1B4F3C] flex items-center justify-center text-4xl font-bold">
                  {getInitials()}
                </div>
            )}
            <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer shadow hover:shadow-md transition">
              📷
              <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
              />
            </label>
            {editMode && photo && (
              <button
                onClick={handleDeletePhoto}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                title="Supprimer la photo"
              >
                X
              </button>
            )}
          </div>
          <p className="font-medium text-gray-800">
            {formData.firstname} {formData.lastname}
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow p-6 xl:w-[65em]">
          <div className="space-y-4">
            {["firstname", "lastname", "phone"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "firstname"
                        ? "Prénom"
                        : field === "lastname"
                            ? "Nom"
                            : "Téléphone"}
                  </label>
                  <input
                      name={field}
                      type="text"
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      readOnly={!editMode}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                          editMode
                              ? "focus:ring-2 ring-[#155250]"
                              : "bg-gray-100 text-gray-700"
                      }`}
                      placeholder={
                        field === "phone" && !formData.phone ? "Non renseigné" : ""
                      }
                  />
                </div>
            ))}
          </div>
          {/* Date de naissance */}
          <div>
            <label className="block mt-2 text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input
                type="date"
                name="birthday"
                value={formData.birthday?.slice(0, 10)}
                onChange={handleChange}
                readOnly={!editMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                    editMode ? "focus:ring-2 ring-[#155250]" : "bg-gray-100 text-gray-700"
                }`}
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="block  mt-2  text-sm font-medium text-gray-700 mb-1">Sexe</label>
            <select
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ${
                    editMode ? "focus:ring-2 ring-[#155250]" : "bg-gray-100 text-gray-700"
                }`}
            >
              <option value="">-- Sélectionner --</option>
              <option value="F">Féminin</option>
              <option value="M">Masculin</option>
              <option value="X">Autre</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="mt-6 flex justify-center gap-4">
            {editMode ? (
                <>
                  <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#155250] text-white rounded hover:bg-[#155250]/90"
                  >
                    Enregistrer
                  </button>
                </>
            ) : (
                <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-[#155250] text-white rounded hover:bg-[#155250]/90"
                >
                  Modifier le profil
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default Profil;