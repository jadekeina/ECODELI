import { useState } from "react";
import styled from "styled-components";
import API_URL from "@/config";

const ForgotPassword = () => {
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage(
        "✅ Si un compte existe, un lien de réinitialisation a été envoyé.",
      );
    } catch (error) {
      setMessage(`❌ ${(error as Error).message}`);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <h2>Mot de passe oublié ?</h2>
        <input
          type="email"
          placeholder="Votre adresse email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
        />
        <button type="submit">Envoyer le lien</button>
        {message && <p className="message">{message}</p>}
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #155250;

  form {
    background: white;
    padding: 40px;
    border-radius: 12px;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  button {
    padding: 12px;
    background-color: #155250;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .message {
    text-align: center;
    color: white;
    background-color: #155250;
    padding: 10px;
    border-radius: 8px;
  }
`;

export default ForgotPassword;
