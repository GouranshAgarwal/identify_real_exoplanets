import axios from "axios"

const API = axios.create({
    baseURL: "http://localhost:8000"
});

export const predictPlanet = async(data) => {
    const response = await API.post("/predict", data);
    return response.data;
}