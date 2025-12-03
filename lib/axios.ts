import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JSON_API_URL,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});
