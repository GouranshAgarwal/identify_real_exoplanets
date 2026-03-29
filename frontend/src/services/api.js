import axios from "axios"

const API = axios.create({
    baseURL: "https://identify-real-exoplanets.onrender.com"
});

export const predictPlanet = async(data) => {
    const response = await API.post("/predict", data);
    return response.data;
}