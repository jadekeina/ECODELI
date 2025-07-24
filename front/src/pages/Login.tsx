import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";
import API_URL from "@/config";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      const receivedToken = data.token; // <-- Récupérer le token directement de la réponse
      if (!receivedToken) {
        throw new Error("Token non reçu après la connexion.");
      }

      localStorage.setItem("token", receivedToken); // Stocker le token dans localStorage
      console.log("📦 Token stocké dans localStorage:", receivedToken.substring(0, 20) + '...');

      // Utiliser le token directement pour la requête /users/me
      const userRes = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${receivedToken}`, // <-- Utiliser receivedToken ici
        },
        credentials: "include",
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        // Optionnel: Ajouter le token à l'objet user dans le contexte si vous en avez besoin côté client
        setUser({ ...userData.user || userData.data, token: receivedToken });
        setMessage("✅ Connexion réussie !");
        setTimeout(() => navigate("/app"), 800);
      } else {
        const errorData = await userRes.json();
        setMessage(`❌ Impossible de récupérer le profil utilisateur: ${errorData.message || userRes.statusText}`);
        // Nettoyer le token si la récupération du profil échoue
        localStorage.removeItem("token");
      }
    } catch (error) {
      setMessage(`❌ ${error instanceof Error ? error.message : "Erreur de connexion"}`);
      console.error("Erreur de connexion complète:", error);
      // S'assurer que le token est retiré en cas d'erreur
      localStorage.removeItem("token");
    }
  };

  return (
      <StyledWrapper>
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex-column">
            <label>Email </label>
          </div>
          <div className="inputForm">
            <input
                type="email"
                name="mail"
                className="input"
                placeholder="Enter your Email"
                value={formData.mail}
                onChange={handleChange}
                required
            />
          </div>

          <div className="flex-column">
            <label>Password </label>
          </div>
          <div className="inputForm">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="input"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <span
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer", marginRight: "10px", color: "#555" }}
            >
            {showPassword ? "👁️" : "🙈"}
          </span>
          </div>

          <div className="flex-row mt-4">
            <div>
              <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="rememberMe"
              />
              <label htmlFor="rememberMe" style={{ marginLeft: 6 }}>
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="span">
              Mot de passe oublié ?
            </Link>
          </div>

          <button className="button-submit">Sign In</button>

          {message && (
              <p
                  style={{
                    textAlign: "center",
                    color: message.startsWith("✅") ? "green" : "red",
                  }}
              >
                {message}
              </p>
          )}

          <p className="p">
            Don't have an account? {" "}
            <Link to="/inscription" className="span">
              Créez-en un
            </Link>
          </p>
          <p className="p line">Or With</p>

          <div className="flex-row">
            <GoogleLoginButton
                onSuccess={() => {
                  setMessage("✅ Connexion Google réussie ! Redirection...");
                }}
                onError={(error) => {
                  setMessage(`❌ ${error}`);
                }}
            />
          </div>
        </form>
      </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #155250;

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
        Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #252727;
  }

  .p {
    text-align: center;
    font-size: 14px;
    margin: 5px 0;
    color: black;
  }

  .btn {
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }
`;

export default Login;
