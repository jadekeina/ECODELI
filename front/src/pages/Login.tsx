import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    mail: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3002/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur de connexion");

      localStorage.setItem("token", data.token);       // stocke le token
      setUser(data.user);                              // met à jour le contexte utilisateur

      setMessage("✅ Connexion réussie !");
      setTimeout(() => {
        navigate("/app");                              // redirige sans recharger la page
      }, 1500);
    } catch {
      setMessage("❌ Identifiants incorrects.");
    }
  };

  return (
      <StyledWrapper>
        <form className="form" onSubmit={handleSubmit}>
          <div className="flex-column"><label>Email </label></div>
          <div className="inputForm">
            <input
                type="email"
                name="mail"
                className="input"
                placeholder="Enter your Email"
                value={formData.mail}
                onChange={handleChange}
            />
          </div>

          <div className="flex-column"><label>Password </label></div>
          <div className="inputForm">
            <input
                type="password"
                name="password"
                className="input"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
            />
          </div>

          <div className="flex-row">
            <div>
              <input type="checkbox" />
              <label>Remember me </label>
            </div>
            <span className="span">Forgot password?</span>
          </div>

          <button className="button-submit">Sign In</button>

          {message && (
              <p style={{ textAlign: "center", color: message.startsWith("✅") ? "green" : "red" }}>
                {message}
              </p>
          )}

          <p className="p">Don't have an account? <Link to="/inscription" className="span">Créez-en un</Link></p>
          <p className="p line">Or With</p>

          <div className="flex-row">
            <button className="btn google">Google</button>
            <button className="btn apple">Apple</button>
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
