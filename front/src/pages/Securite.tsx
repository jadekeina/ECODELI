import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "@/config";
import { useTranslation } from "react-i18next";

const Securite = () => {
  const { user, setUser } = useContext(UserContext);
  const realUser = user?.user || user;
  const navigate = useNavigate();
  const { t } = useTranslation();

  // États pour la modale de changement de mot de passe
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [editPwd, setEditPwd] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      t('security.confirm_delete'),
    );
    if (!confirmDelete) return;
    const token = localStorage.getItem("token");
    if (!token) return alert(t('security.not_connected'));

    try {
      await axios.delete(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Utiliser les cookies en plus
      });
      localStorage.removeItem("token");
      setUser(null);
      alert(t('security.account_deleted'));
      navigate("/");
    } catch (err) {
      alert(t('security.account_delete_error'));
    }
  };

  const handleChangePassword = () => setShowPwdModal(true);

  const handlePwdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return alert(t('security.not_connected'));

    try {
      await axios.patch(
        `${API_URL}/users/me`,
        {
          password: newPwd,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Utiliser les cookies en plus
        },
      );
      alert(t('security.password_changed'));
      setEditPwd(false);
      setNewPwd("");
    } catch (err) {
      alert(t('security.password_change_error'));
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl flex flex-col items-center mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800"> {t('security.title')}</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6 w-[60em]">
        <div className="bg-[#E9FADF] border border-[#155250] p-4 rounded-md text-[#155250] ">
          {t('security.configure_profile')}
          <a href="#" className="ml-2 underline text-sm">
            {t('security.how_it_works')}
          </a>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="text-sm text-gray-500">{t('security.email')}</p>
              <p className="text-gray-800 font-medium">{realUser?.mail}</p>
            </div>
            <button
              className="px-4 py-1 border border-[#155250]  text-[#155250]  rounded-md hover:bg-blue-50 text-sm"
              disabled
            >
              {t('security.edit')}
            </button>
          </div>

          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="text-sm text-gray-500">{t('security.change_password')}</p>
            </div>
            {editPwd ? (
              <form
                onSubmit={handlePwdSubmit}
                className="flex gap-2 items-center"
              >
                <input
                  type="password"
                  placeholder={t('security.new_password')}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="border rounded px-3 py-2 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditPwd(false);
                    setNewPwd("");
                  }}
                  className="px-3 py-1 bg-gray-200 rounded text-sm"
                >
                  {t('security.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-[#155250]  text-white rounded text-sm"
                  disabled={loading}
                >
                  {loading ? "..." : t('security.validate')}
                </button>
              </form>
            ) : (
              <button
                onClick={() => setEditPwd(true)}
                className="px-4 py-1 border border-[#155250]  text-[#155250]  rounded-md hover:bg-blue-50 text-sm"
              >
                {t('security.edit')}
              </button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{t('security.delete_account')}</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-1 border border-red-500 text-red-600 rounded-md hover:bg-red-50 text-sm"
            >
              {t('security.delete')}
            </button>
          </div>
        </div>
      </div>

      {/* Modale de changement de mot de passe minimaliste */}
      {showPwdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handlePwdSubmit}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-4 min-w-[300px]"
          >
            <p className="text-base font-medium">{t('security.new_password')}</p>
            <input
              type="password"
              placeholder={t('security.new_password')}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowPwdModal(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                {t('security.cancel')}
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "..." : t('security.validate')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Securite;
