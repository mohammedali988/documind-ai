import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractText(
  fileBuffer: Buffer,
  fileType: string,
): Promise<string> {
  if (fileType === "pdf") {
    const parser = new PDFParse({ data: fileBuffer, CanvasFactory });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (fileType === "docx") {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

export async function createChunk(
  extractText: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ chunks: any[]; vectors: number[][] }> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // characters per chunk
    chunkOverlap: 200, // overlap between chunks
  });

  const chunks = await splitter.createDocuments([extractText]);

  // 2. Generate embeddings with Google AI
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "models/gemini-embedding-001",
  });

  const vectors = await Promise.all(
    chunks.map((chunk) => embeddings.embedQuery(chunk.pageContent)),
  );

  return { chunks, vectors };
}

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
