import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const ai = new GoogleGenAI({apiKey: "AIzaSyDlYI9B3unkyA8ma6yJon0olTILaaPgXH4"});

