import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import API_URL from "@/config";
import { useTranslation } from "react-i18next";

// Fonction pour récupérer le token depuis les cookies

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
    country: realUser?.country || "",
    city: realUser?.city || "",
    address: realUser?.address || "",
    organization: realUser?.organization || "",
    department: realUser?.department || "",
    zipcode: realUser?.zipcode || "",
  });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { t, i18n } = useTranslation();

  const langMap: { [key: string]: string } = {
    "fr": "Français (France)",
    "en": "English (US)",
    "it": "Italiano",
    "es": "Español (España)",
    "de": "Deutsch",
    "pt": "Português (Brasil)",
    "zh": "正體字"
  };

  const reverseLangMap: { [key: string]: string } = Object.fromEntries(
    Object.entries(langMap).map(([k, v]) => [v, k])
  );

  const [selectedLanguage, setSelectedLanguage] = useState(langMap[i18n.language] || "Français (France)");

  useEffect(() => {
    // Met à jour le sélecteur si la langue change ailleurs dans l'app
    setSelectedLanguage(langMap[i18n.language] || "Français (France)");
  }, [i18n.language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedLanguage(selected);
    const newLang = reverseLangMap[selected] || "fr";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const defaultPictures = ["default.jpg", "/uploads/default-avatar.png"];
    if (
      realUser?.profilpicture &&
      !defaultPictures.includes(realUser.profilpicture)
    ) {
      setPhoto(`${API_URL}${realUser.profilpicture}`);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
      firstname: realUser?.firstname || "",
      lastname: realUser?.lastname || "",
      phone: realUser?.phone || "",
      birthday: realUser?.birthday || "",
      sexe: realUser?.sexe || "",
      country: realUser?.country || "",
      city: realUser?.city || "",
      address: realUser?.address || "",
      organization: realUser?.organization || "",
      department: realUser?.department || "",
      zipcode: realUser?.zipcode || "",
    });
    setEditMode(false);
    setPhotoFile(null);
    if (realUser?.profilpicture) {
      setPhoto(`${API_URL}${realUser.profilpicture}`);
    } else {
      setPhoto(null);
    }
  };

  const handleDeletePhoto = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("profile.not_logged_in"));
      return;
    }

    if (!confirm(t("profile.confirm_delete_photo"))) {
      return;
    }

    try {
      const { data: updatedUser } = await axios.delete(
        `${API_URL}/api/users/me/photo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(updatedUser); // Mettre à jour le contexte
      setPhoto(null); // Mettre à jour l'aperçu local
      setPhotoFile(null);
      alert(t("profile.photo_deleted"));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert(t("profile.error_deleting_photo"));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("profile.not_logged_in"));
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/api/users/me`,
        { ...formData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (photoFile) {
        const photoFormData = new FormData();
        photoFormData.append("photo", photoFile);

        const { data: updatedUser } = await axios.patch(
          `${API_URL}/api/users/me/photo`,
          photoFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        setUser(updatedUser);
      } else {
        if (user) {
          setUser({ ...user, ...formData });
        }
      }

      alert(t("profile.profile_updated"));
      setEditMode(false);
      setPhotoFile(null);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      alert(t("profile.error_updating_profile"));
    }
  };

  return (
    <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
      <div className="mb-4 col-span-full xl:mb-2">
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          {t("profile.settings")}
        </h1>
      </div>

      {/* Profile Picture Section */}

      <div className="space-y-4 xl:col-span-1">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="items-center sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
            <div className="relative mb-4 sm:mb-0 xl:mb-4 2xl:mb-0 w-28 h-28">
              {photo ? (
                <img
                  src={photo}
                  onError={() => setPhoto(null)}
                  className="w-28 h-28 rounded-lg object-cover border border-gray-300"
                  alt="Profile"
                />
              ) : (
                <div className="w-28 h-28 rounded-lg bg-[#E9FADF] text-[#1B4F3C] flex items-center justify-center text-4xl font-bold">
                  {getInitials()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer shadow hover:shadow-md transition">
                <svg
                  className="w-4 h-4 text-gray-800 dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                  <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={!editMode}
                />
              </label>
            </div>
            <div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
                {t("profile.picture")}
              </h3>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {t("profile.accepted_formats")}
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector<HTMLInputElement>('input[type="file"]')
                      ?.click()
                  }
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={!editMode}
                >
                  <svg
                    className="w-4 h-4 mr-2 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                  </svg>
                  {t("profile.upload_picture")}
                </button>
                <button
                  type="button"
                  onClick={handleDeletePhoto}
                  className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  disabled={!editMode || !photo}
                >
                  {t("profile.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Language Settings Section */}
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-1 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">
            {t("profile.language_settings")}
          </h3>
          <div className="mb-4">
            <label
              htmlFor="settings-language"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t("profile.select_language")}
            </label>
            <select
              id="settings-language"
              name="language"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option>Français (France)</option>
              <option>English (US)</option>
            </select>
          </div>
        </div>
    </div>
        {/* Profile Details Section */}
        <div className="space-y-4 xl:col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              {t("profile.general_information")}
            </h3>
            <form>
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="firstname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.firstname")}
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.firstname")}
                    value={formData.firstname}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="lastname"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.lastname")}
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.lastname")}
                    value={formData.lastname}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.phone")}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.phone")}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                {/* Ajout des nouveaux champs */}
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.country")}
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.country")}
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="city"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.city")}
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.address")}
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.address")}
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="organization"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.organization")}
                  </label>
                  <input
                    type="text"
                    name="organization"
                    id="organization"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.organization")}
                    value={formData.organization}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="department"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.department")}
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.department")}
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="zipcode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.zipcode")}
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    id="zipcode"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder={t("profile.zipcode")}
                    value={formData.zipcode}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="birthday"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.birthday")}
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    id="birthday"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.birthday}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="sexe"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {t("profile.gender")}
                  </label>
                  <select
                    name="sexe"
                    id="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                    disabled={!editMode}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="">{t("profile.gender_select")}</option>
                    <option value="F">{t("profile.gender_female")}</option>
                    <option value="M">{t("profile.gender_male")}</option>
                    <option value="X">{t("profile.gender_other")}</option>
                  </select>
                </div>
              </div>
            </form>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    {t("profile.cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    className="text-white bg-[#142D2D] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {t("profile.save")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-white bg-[#142D2D] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {t("profile.edit_profile")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

  );
};

export default Profil;
