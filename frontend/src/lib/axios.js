import axios from "axios";

const production = process.env.NODE_ENV === 'production';

export const axiosInstance = axios.create({
    baseURL: production ? "https://hydraone-dev-backend.onrender.com" : "http://localhost:8081",
    withCredentials: true,
     headers: {
        'Content-Type': 'application/json'
    }
});