import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "@/config";

const EmailConfirmed = () => {
    const { token } = useParams();
    const [message, setMessage] = useState("Vérification en cours...");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/auth/verify-email/${token}`)
            .then(res => res.json())
            .then(data => {
                setMessage(data.message || "✅ Adresse email confirmée !");
                setSuccess(true);
            })
            .catch(() => {
                setMessage("❌ Erreur lors de la confirmation de l’adresse email.");
                setSuccess(false);
            });
    }, [token]);

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#155250", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", textAlign: "center" }}>
                <h2>{message}</h2>
                {success && (
                    <>
                        <p>Vous pouvez maintenant vous connecter à votre compte.</p>
                        <Link to="/connexion" style={{ marginTop: "20px", display: "inline-block", padding: "12px 24px", backgroundColor: "#155250", color: "white", borderRadius: "10px", textDecoration: "none" }}>
                            Se connecter
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default EmailConfirmed;
