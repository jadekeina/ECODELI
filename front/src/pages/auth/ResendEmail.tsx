import { useState } from "react";
import styled from "styled-components";
import API_URL from "@/config";

const ResendEmail = () => {
    const [mail, setMail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/auth/resend-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la requête");
            }

            setMessage("✅ Un nouveau mail de confirmation a été envoyé !");
        } catch (error) {
            setMessage(`❌ ${error instanceof Error ? error.message : "Erreur inconnue"}`);
        }
    };

    return (
        <ResendWrapper>
            <form className="form" onSubmit={handleSubmit}>
                <h2>Renvoyer l'email de confirmation</h2>

                <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    required
                />

                <button type="submit">Renvoyer</button>

                {message && (
                    <p style={{ color: message.startsWith("✅") ? "green" : "red", marginTop: "15px" }}>{message}</p>
                )}
            </form>
        </ResendWrapper>
    );
};

const ResendWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #155250;

  .form {
    background-color: white;
    padding: 40px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 400px;
    font-family: sans-serif;
  }

  input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }

  button {
    padding: 12px;
    background-color: #155250;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }

  button:hover {
    background-color: #1c6b66;
  }
`;

export default ResendEmail;
