import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("=== generateContent.js loaded ===");
console.log("GEMINI_KEY exists:", !!process.env.GEMINI_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Generate fallback content when API fails
export const generateFallbackContent = (prompt) => {
  const fallbackTemplates = {
    default: `Nội dung được tạo tự động dựa trên chủ đề: "${prompt}"\n\nĐây là nội dung mẫu vì API đang bảo trì. Vui lòng quay lại sau hoặc chỉnh sửa nội dung này theo ý của bạn.`
  };
  
  return fallbackTemplates.default;
};

export const generateContent = async (prompt) => {
  try {
    if (!process.env.GEMINI_KEY) {
      throw new Error("GEMINI_KEY is not defined in environment variables");
    }

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    console.log("=== Calling Gemini API with prompt:", prompt.substring(0, 50) + "... ===");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("=== Gemini API success ===");
    return text;
  } catch (error) {
    console.error("=== Gemini API Error ===", error.status, error.statusText);
    throw new Error(`Failed to generate content: ${error.message}`);
  }
};
