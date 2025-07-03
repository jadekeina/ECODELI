// src/config.ts
// @ts-expect-error
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

export default API_URL;
