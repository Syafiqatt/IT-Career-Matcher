import axios from "axios";
import { config } from "../config/index.js";

const client = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 120000,
});

/** Ambil daftar opsi (skills/tools/databases/careers) dari ML service. */
export async function fetchVocab() {
  try {
    console.log("=== calling ML /vocab ===");
    const { data } = await client.get("/vocab");
    console.log("=== ML /vocab success ===");
    return data;
  } catch (err) {
    console.error("=== ML /vocab error ===");
    console.error("message:", err.message);
    console.error("code:", err.code);
    console.error("status:", err.response?.status);
    console.error("data:", err.response?.data);
    throw err;
  }
}

/** Minta prediksi rekomendasi karir ke ML service. */
export async function predictCareer(profile) {
  try {
    console.log("=== calling ML /predict ===");
    console.log("ML_SERVICE_URL:", config.mlServiceUrl);
    console.log("profile:", profile);

    const { data } = await client.post("/predict", profile);

    console.log("=== ML /predict success ===");
    console.log("data:", data);

    return data;
  } catch (err) {
    console.error("=== ML /predict error ===");
    console.error("message:", err.message);
    console.error("code:", err.code);
    console.error("status:", err.response?.status);
    console.error("data:", err.response?.data);

    throw err;
  }
}

/** Cek kesehatan ML service. */
export async function mlHealth() {
  const { data } = await client.get("/health");
  return data;
}
