import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_URL from "@/config";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirm) {
            setMessage("❌ Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            setMessage("✅ Mot de passe réinitialisé avec succès !");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage(`❌ ${(error as Error).message}`);
        }
    };

    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h2>Réinitialiser le mot de passe</h2>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                />
                <button type="submit">Réinitialiser</button>
                {message && <p className="message">{message}</p>}
            </form>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: #155250;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    background: white;
    padding: 40px;
    border-radius: 12px;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 15px;
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
    margin-top: 10px;
    text-align: center;
    color: white;
    background: #155250;
    padding: 10px;
    border-radius: 8px;
  }
`;

export default ResetPassword;
