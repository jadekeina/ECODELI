import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "leaflet/dist/leaflet.css";

const GOOGLE_CLIENT_ID = "1021864048546-eqov88opmgtoeplrrff5hitf1u6qmdsk.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <UserProvider>
                    <App />
                </UserProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>
);
