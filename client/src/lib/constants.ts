import { lisk, liskSepolia } from "viem/chains";

const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

export const network = ENVIRONMENT === "development" ? liskSepolia : lisk;

export const BACKEND_URL = ENVIRONMENT === "development" ? "http://localhost:3000" : "https://pronouns-lisk-demo.onrender.com";
