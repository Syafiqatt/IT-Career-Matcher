import axios from "axios";
import { config } from "../config/index.js";

const client = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 15000,
});

/** Ambil daftar opsi (skills/tools/databases/careers) dari ML service. */
export async function fetchVocab() {
  const { data } = await client.get("/vocab");
  return data;
}

/** Minta prediksi rekomendasi karir ke ML service. */
export async function predictCareer(profile) {
  const { data } = await client.post("/predict", profile);
  return data; // { model_name, recommendations: [...] }
}

/** Cek kesehatan ML service. */
export async function mlHealth() {
  const { data } = await client.get("/health");
  return data;
}
