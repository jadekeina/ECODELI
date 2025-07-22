console.log("🌐 API_URL = ", import.meta.env.VITE_API_URL);
const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:3002";
export default API_URL;
