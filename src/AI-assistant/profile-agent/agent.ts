import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Agent for profile management
export class ProfileAgent {
  async getProfile(userId: string): Promise<object> {
    // AI logic to get user profile
    return { name: 'User', email: 'user@example.com' }; // placeholder
  }

  async updateProfile(userId: string, data: object): Promise<boolean> {
    // AI logic to update profile
    return true; // placeholder
  }
}

export class CodingAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(" GEMINI_API_KEY is missing in environment variables");
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  // Initialize model after listing available ones
  async initModel() {
    // listModels() returns { models: [...] }
    const response = await this.genAI.listModels();
    const modelsArray = response.models; // <-- fix applied

    const desiredModel = modelsArray.find(
      (m: any) => m.name === "models/chat-bison-001"
    );

    if (!desiredModel) {
      throw new Error(
        " Model 'chat-bison-001' is not available for this API key"
      );
    }

    this.model = this.genAI.getGenerativeModel({ model: "models/chat-bison-001" });
    console.log("Using model:", this.model.modelName || "chat-bison-001");
  }

  async assistCoding(code: string): Promise<string> {
    try {
      const prompt = `
Please review and improve the following code.
Provide:
- best practices
- optimizations
- possible bugs
- cleaner alternatives

Code:
${code}
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error in assistCoding:", error);
      return "Error occurred while processing the code.";
    }
  }

  async chat(message: string): Promise<string> {
    try {
      const prompt = `You are a helpful coding assistant. Respond clearly and concisely.

User: ${message}
Assistant:
      `;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Error in chat:", error);
      return "Error occurred while processing the message.";
    }
  }
}
