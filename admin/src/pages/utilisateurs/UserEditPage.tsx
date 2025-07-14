import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserSettingsPage() {
  // Données fictives pour pré-remplir (à remplacer par l'appel API plus tard)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    address: "",
    email: "example@company.com",
    phone: "",
    birthday: "",
    organization: "",
    role: "",
    department: "",
    zipcode: ""
  });

  // Pour l'upload photo, tu ajoutes ta logique plus tard
  const [avatar, setAvatar] = useState("/images/users/bonnie-green-2x.png");
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`)
      .then(res => {
        console.log("Réponse API:", res.data);
        const user = res.data.user || res.data.data; // adapte selon la vraie structure
        if (!user) return; // ou affiche un message d'erreur
        setForm(form => ({
          ...form,
          firstName: user.firstname || "",
          lastName: user.lastname || "",
          email: user.mail || "",
          // Ajoute ici les correspondances pour les autres champs si besoin
          // country: user.country || "",
          // city: user.city || "",
          // etc.
        }));
        // Si tu veux aussi l’avatar :
        if (user.profilpicture) setAvatar(user.profilpicture);
      })
      .catch(() => {
        // Optionnel : gestion d’erreur
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        firstname: form.firstName,
        lastname: form.lastName,
        country: form.country,
        city: form.city,
        address: form.address,
        phone: form.phone,
        birthday: form.birthday ? form.birthday:null,
        organization: form.organization,
        role: form.role || "client",
        department: form.department,
        zipcode: form.zipcode,
        // Ajoute d'autres champs si besoin
      };

  try {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, payload);
    setEditMode(false);
    // Optionnel : affiche un message de succès
    alert("Modifications enregistrées !");
  } catch (err) {
    // Optionnel : affiche un message d'erreur
    alert("Erreur lors de l'enregistrement !");
  }

  };

  return (
    <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900 min-h-screen">
      <div className="mb-4 col-span-full xl:mb-2">
        <nav className="flex mb-5" aria-label="Breadcrumb">
          <ol className="inline-flex  space-x-1 text-sm font-medium md:space-x-2">
            <li className="inline-flex items-center">
              <a href="#" className="inline-flex items-center text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white">
                <svg className="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <a href="#" className="ml-1 text-gray-700 hover:text-primary-600 md:ml-2 dark:text-gray-300 dark:hover:text-white">Users</a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                <span className="ml-1 text-gray-400 md:ml-2 dark:text-gray-500" aria-current="page">Settings</span>
              </div>
            </li>
          </ol>
        </nav>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">User settings</h1>
      </div>

      {/* LEFT COLUMN */}
      <div className="col-span-full xl:col-auto flex flex-col space-y-4">
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <img className="mb-4 rounded-lg w-28 h-28 object-cover" src={avatar} alt="Avatar" />
            <div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile picture</h3>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                JPG, GIF or PNG. Max size of 800K
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  <svg className="w-4 h-4 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path><path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path></svg>
                  Upload picture
                </button>
                <button type="button" className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Language & Time */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">Language & Time</h3>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select language</label>
            <select className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              <option>English (US)</option>
              <option>Italiano</option>
              <option>Français (France)</option>
              <option>正體字</option>
              <option>Español (España)</option>
              <option>Deutsch</option>
              <option>Português (Brasil)</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time Zone</label>
            <select className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              <option>GMT+0 Greenwich Mean Time (GMT)</option>
              <option>GMT+1 Central European Time (CET)</option>
              <option>GMT+2 Eastern European Time (EET)</option>
              <option>GMT+3 Moscow Time (MSK)</option>
              <option>GMT+5 Pakistan Standard Time (PKT)</option>
              <option>GMT+8 China Standard Time (CST)</option>
              <option>GMT+10 Eastern Australia Standard Time (AEST)</option>
            </select>
          </div>
          <button className="text-white bg-[#155250] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            Save all
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-2">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700  dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold dark:text-white">General information</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="Bonnie" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="Green"  disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
                <input type="text" name="country" value={form.country} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="United States"  disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="e.g. San Francisco"  disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                <input type="text" name="address" value={form.address} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="e.g. California"  disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                  disabled
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="e.g. +(12)3456 789" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                <input type="text" name="birthday" value={form.birthday} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="15/08/1990" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Organization</label>
                <input type="text" name="organization" value={form.organization} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="Company Name" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                <input type="text" name="role" value={form.role} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="React Developer" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
                <input type="text" name="department" value={form.department} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="Development" disabled={!editMode} />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Zip/postal code</label>
                <input type="text" name="zipcode" value={form.zipcode} onChange={handleChange} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="123456" disabled={!editMode} />
              </div>
              <div className="col-span-6 flex items-center justify-center">
                {editMode && (
                  <button
                    type="submit"
                    className="mb-4 px-4 py-2 bg-[#155250] text-white rounded"
                  >
                    Enregistrer
                  </button>
                )}
              </div>
            </div>
          </form>
          
          {/* Bouton Modifier en dehors du formulaire */}
          {!editMode && (
            <div className="flex items-center justify-center mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-[#155250] text-white rounded"
                onClick={() => setEditMode(true)}
              >
                Modifier
              </button>
            </div>
          )}
        </div>
        {/* ... Tu ajoutes ici les autres panneaux ("Password information", "Sessions", etc.) comme dans le template Flowbite si tu veux */}
      </div>
    </div>
  );
}
