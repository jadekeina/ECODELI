import { Link } from "react-router-dom";

const EmailConfirmed = () => {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#155250", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "20px", textAlign: "center" }}>
                <h2>✅ Adresse email confirmée !</h2>
                <p>Vous pouvez maintenant vous connecter à votre compte.</p>
                <Link to="/login" style={{ marginTop: "20px", display: "inline-block", padding: "12px 24px", backgroundColor: "#155250", color: "white", borderRadius: "10px", textDecoration: "none" }}>
                    Se connecter
                </Link>
            </div>
        </div>
    );
};

export default EmailConfirmed;
