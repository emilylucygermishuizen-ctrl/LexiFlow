
import { GoogleGenAI } from "@google/genai";
import type { Note, Event, ModalSource } from "../types";
import { isToday, isFuture } from "date-fns";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getApiResponse = async (prompt: string, systemInstruction: string, useGrounding: boolean) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                ...(systemInstruction && { systemInstruction }),
                ...(useGrounding && { tools: [{ googleSearch: {} }] }),
            },
        });

        const text = response.text;
        let sources: ModalSource[] = [];

        if (useGrounding) {
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            sources = groundingChunks
                .map(chunk => (chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null))
                .filter((source): source is ModalSource => source !== null && !!source.uri && !!source.title);
        }

        return { text, sources };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to get response from AI. Please check your connection or API key.");
    }
};

export const getDailyFocus = async (events: Event[], notes: Note[]) => {
    const upcoming = events
      .filter(event => isToday(event.date) || isFuture(event.date))
      .map(e => e.title).join(', ');
    const recentN = notes.slice(0, 2).map(n => n.subject).join(', ');
    
    const prompt = `I'm a law student. Based on my upcoming schedule and recent study topics, give me a single, encouraging paragraph (max 3-4 sentences) suggesting what I should focus on today.\n\nUpcoming Events: ${upcoming || 'None'}\nRecent Note Subjects: ${recentN || 'None'}`;
    const systemInstruction = "You are a friendly and encouraging law school tutor. Be concise and motivational.";
    
    return getApiResponse(prompt, systemInstruction, false);
};

export const explainCase = async (caseName: string, citation: string) => {
    const prompt = `Find and briefly summarize the legal case: ${caseName}, ${citation}. Explain its core legal principle and significance in U.S. law. Keep the summary to 2-3 paragraphs.`;
    const systemInstruction = "You are a helpful legal assistant. Provide a concise, easy-to-understand summary of the requested court case, focusing on the facts, the holding, and the legal principle it established.";
    
    return getApiResponse(prompt, systemInstruction, true);
};

export const generateStudyPlan = async (eventTitle: string) => {
    const prompt = `Generate a 5-step, actionable study plan for my upcoming "${eventTitle}".`;
    const systemInstruction = "You are a helpful academic advisor. Create a concise, scannable, step-by-step study plan (as a bulleted list) for the user's upcoming legal exam or assignment. Keep it brief and focused.";
    
    return getApiResponse(prompt, systemInstruction, false);
};

export const summarizeNote = async (note: Note) => {
    const attachmentNames = note.attachments.map(att => att.name).join(', ');
    const prompt = `I have a study note titled "${note.title}". It has the following files attached: ${attachmentNames || 'None'}. Please provide a 1-2 paragraph summary of what this note likely covers, based on its title and the attached file names. Speculate on the key concepts and connections.`;
    const systemInstruction = "You are a helpful law study assistant. Given a note's title and its attached file names, provide a brief, insightful summary of the likely topic and its key components. You cannot read the files, so base your summary on the titles provided.";

    return getApiResponse(prompt, systemInstruction, false);
};
