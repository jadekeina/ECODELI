import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_URL from "@/config";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Register = () => {
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    mail: "",
    password: "",
    username: "", // valeur automatique unique
    profilpicture: "",
    sexe: "",
    birthday: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription");
      }

      const data = await response.json();
      setMessage("✅ Compte créé avec succès !");
      console.log("Réponse :", data);
      setTimeout(() => navigate("/connexion"), 2000);
    } catch (error) {
      setMessage("❌ Une erreur est survenue.");
      console.error(error);
    }
  };

  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <div className="flex-column">
          <label>Nom</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            name="lastname"
            className="input"
            placeholder="Entrez votre nom"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column">
          <label>Prénom</label>
        </div>
        <div className="inputForm">
          <input
            type="text"
            name="firstname"
            className="input"
            placeholder="Entrez votre prénom"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column">
          <label>Email</label>
        </div>
        <div className="inputForm">
          <input
            type="email"
            name="mail"
            className="input"
            placeholder="Entrez votre email"
            value={formData.mail}
            onChange={handleChange}
          />
        </div>

        <div className="flex-column">
          <label>Mot de passe</label>
        </div>
        <div className="inputForm">
          <input
            type="password"
            name="password"
            className="input"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="button-submit">
          S'inscrire
        </button>
        {message && (
          <p
            style={{
              color: message.startsWith("✅") ? "green" : "red",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
        <p className="p">
          Vous avez déjà un compte ?{" "}
          <Link to="/connexion" className="span">
            Connectez-vous
          </Link>
        </p>
        <div className="flex-row">
          <GoogleLoginButton
            onSuccess={() => {
              setMessage("✅ Inscription Google réussie !");
              setTimeout(() => navigate("/app"), 2000);
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
  padding: 80px 0;

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
    transition: 0.2s ease-in-out;
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

  .flex-column > label {
    color: #151717;
    font-weight: 600;
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
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
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

export default Register;
