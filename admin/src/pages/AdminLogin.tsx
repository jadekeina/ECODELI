import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import API_URL from "../../config";

const AdminLogin = () => {
    const [formData, setFormData] = useState({ mail: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("🔄 Tentative de connexion...", { mail: formData.mail });

            const response = await fetch(`${API_URL}/auth/admin-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, rememberMe }),
            });

            const data = await response.json();
            console.log("📥 Réponse serveur:", data);

            if (!response.ok) {
                throw new Error(data.message || `Erreur ${response.status}`);
            }

            if (data.user && data.user.token) {
                localStorage.setItem("token", data.user.token);
                console.log("✅ Token sauvegardé:", data.user.token);
            }

            setMessage("✅ Connexion réussie !");

            // Redirection immédiate vers le dashboard
            console.log("🔄 Redirection vers /dashboard/overview...");
            navigate("/dashboard/overview", { replace: true });

        } catch (error) {
            console.error("❌ Erreur de connexion:", error);
            setMessage(
                `❌ ${error instanceof Error ? error.message : "Erreur de connexion"}`
            );
        } finally {
            setIsLoading(false);
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
                        placeholder="admin@ecodeli.com"
                        value={formData.mail}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex-column">
                    <label>Mot de passe </label>
                </div>
                <div className="inputForm">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", marginRight: "10px", color: "#555" }}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </span>
                </div>

                <div className="flex-row mt-4">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        id="rememberMe"
                        disabled={isLoading}
                    />
                    <label htmlFor="rememberMe" style={{ marginLeft: 6 }}>
                        Se souvenir de moi
                    </label>
                </div>

                <button
                    className="button-submit"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Connexion..." : "Connexion admin"}
                </button>

                {message && (
                    <p
                        style={{
                            textAlign: "center",
                            color: message.startsWith("✅") ? "green" : "red",
                            marginTop: "10px"
                        }}
                    >
                        {message}
                    </p>
                )}
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

    .input:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }

    .inputForm:focus-within {
        border: 1.5px solid #2d79f3;
    }

    .flex-row {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
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
        transition: background-color 0.2s;
    }

    .button-submit:hover:not(:disabled) {
        background-color: #252727;
    }

    .button-submit:disabled {
        background-color: #999;
        cursor: not-allowed;
    }

    .p {
        text-align: center;
        font-size: 14px;
        margin: 5px 0;
        color: black;
    }
`;

export default AdminLogin;