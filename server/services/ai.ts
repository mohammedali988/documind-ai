import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function aiProcess(
  context: string,
  userText: string,
): Promise<string> {
  let answer = "";
  const prompt = `You are DocuMind AI, an intelligent assistant 
                        that answers questions based strictly on the 
                        provided document context. 

                        Rules:
                            - If the question is greeting one answer it politely 
                            - Only use information from the provided context
                            - If the answer is not in the context, say so
                            - Always cite which document the information 
                                came from
                            - Be concise and professional". here is the Context:${context} Question: ${userText} Answer:`;

  try {
    const result = await model.generateContent(prompt);
    answer = result.response.text();
    console.log(answer, "hereeeeee")
  } catch (err) {
    console.error("Gemini Error:", err);

    throw new Error("AI processing failed. Please try again.");
  }
  return answer;
}
