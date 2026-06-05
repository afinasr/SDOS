"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.status === 503 || error?.message?.includes('503')) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateProposal(notes: string, budget?: string) {
  if (!apiKey) throw new Error("Gemini API key is not configured.");
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

  const prompt = `
    You are an AI assistant for a high-end photography/videography studio.
    A lead has provided the following raw notes:
    "${notes}"
    Their approximate budget is: ${budget || "Unknown"}.
    
    Please generate a professional, persuasive proposal paragraph AND suggest 2-4 line items with estimated prices in INR (₹) that fit their requirements and budget.
    Return JSON ONLY with this structure:
    {
      "proposalText": "A persuasive paragraph summarizing what we will offer...",
      "lineItems": [
        { "desc": "e.g., 2-Day Candid Photography", "price": 150000 }
      ]
    }
  `;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    const text = result.response.text();
    return JSON.parse(text);
  } catch (e: any) {
    throw new Error("Failed to generate proposal: " + e.message);
  }
}

export async function cleanUpNotes(rawNotes: string) {
  if (!apiKey) throw new Error("Gemini API key is not configured.");
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Clean up these messy, raw notes taken during a client call for a photography studio.
    Format them into a clean, bulleted list with categories like 'Event Details', 'Requirements', and 'Key Vibe/Style'. Keep it concise.
    
    Raw Notes:
    ${rawNotes}
  `;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
  } catch (e: any) {
    throw new Error("Failed to clean up notes: " + e.message);
  }
}

export async function draftMessage(context: any, customPrompt?: string) {
  if (!apiKey) throw new Error("Gemini API key is not configured.");
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are writing a message to a client on behalf of a premium photography studio.
    Project Name: ${context.client_name || 'The Client'}
    Status: ${context.status}
    Event Date: ${context.event_date || 'TBD'}
    
    Additional Instructions: ${customPrompt || 'Write a polite check-in or update based on their current status.'}
    
    Write the exact message body (no subject line). Keep it warm, professional, and concise. 
  `;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
  } catch (e: any) {
    throw new Error("Failed to draft message: " + e.message);
  }
}

export async function chatWithStudio(query: string) {
  if (!apiKey) throw new Error("Gemini API key is not configured.");
  
  // First, gather context from DB
  const { data: projects } = await supabase.from('projects').select('id, title, status, total_value, event_date, client_name');
  const { data: crew } = await supabase.from('crew_members').select('id, name, role');
  const { data: expenses } = await supabase.from('expenses').select('amount, category');
  
  const contextData = {
    projectsCount: projects?.length || 0,
    projects: projects,
    crewCount: crew?.length || 0,
    totalExpenses: expenses?.reduce((acc, exp) => acc + Number(exp.amount), 0) || 0
  };

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are 'Studio AI', a data assistant for a photography studio CRM.
    The user is asking a question about their business data.
    
    Here is the current database context:
    ${JSON.stringify(contextData, null, 2)}
    
    User Query: "${query}"
    
    Answer the user's query clearly and concisely based ONLY on the provided context data. If you don't know, say so. Do not invent data. Use markdown for formatting.
  `;

  try {
    const result = await withRetry(() => model.generateContent(prompt));
    return result.response.text();
  } catch (e: any) {
    throw new Error("Failed to query studio data: " + e.message);
  }
}
