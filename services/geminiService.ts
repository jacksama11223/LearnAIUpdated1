
import { GoogleGenAI, Type } from "@google/genai";

// Helper: Fetch content from URL using a CORS proxy with fallback
const fetchUrlContent = async (url: string): Promise<string> => {
  // Danh sách các Proxy để dự phòng nếu cái này lỗi thì dùng cái kia
  const proxies = [
    {
      url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      handler: async (res: Response) => res.text()
    },
    { 
      url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      handler: async (res: Response) => {
        const data = await res.json();
        return data.contents;
      }
    },
    {
      url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
      handler: async (res: Response) => res.text()
    }
  ];

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy.url);
      if (!response.ok) continue;
      
      const content = await proxy.handler(response);
      if (content && content.length > 50) return content; // Chỉ trả về nếu có nội dung thực
    } catch (error) {
      console.warn("Proxy failed, trying next...", error);
    }
  }

  throw new Error("Không thể truy cập trang web này (bị chặn CORS hoặc tường lửa). Hãy thử copy nội dung văn bản và dán trực tiếp.");
};

// Helper: Clean HTML to extract meaningful text (remove scripts, styles, ads)
const cleanHtmlContent = (html: string): string => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove unwanted elements
    const scripts = doc.querySelectorAll('script, style, iframe, nav, footer, header, noscript, svg, .ad, .ads, .advertisement, .sidebar, .popup');
    scripts.forEach(script => script.remove());

    // Get text content
    let text = doc.body.textContent || "";
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  } catch (e) {
    console.error("Error parsing HTML:", e);
    return html.substring(0, 50000); // Fallback
  }
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  customSystemInstruction?: string
): Promise<string> => {
  try {
    const defaultInstruction = "You are a friendly, encouraging AI tutor for LearnAI. You help users learn languages and subjects using the Socratic method and spaced repetition concepts. Keep answers concise, helpful, and motivating.";
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: customSystemInstruction || defaultInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "Xin lỗi, tôi đang gặp sự cố kết nối.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Xin lỗi, hiện tại hệ thống đang bận. Vui lòng thử lại sau.";
  }
};

/**
 * Giai đoạn 1: Quét và trích xuất nội dung từ URL
 */
export const scanUrlForContent = async (input: string): Promise<string> => {
    // 1. Kiểm tra xem có phải URL không
    const urlPattern = /^(http|https):\/\/[^ "]+$/;
    const isUrl = urlPattern.test(input.trim());

    if (!isUrl) {
        // Nếu là text thường, trả về nguyên vẹn
        return input;
    }

    // 2. Nếu là URL, thực hiện fetch và clean
    try {
        const rawHtml = await fetchUrlContent(input.trim());
        const cleanedText = cleanHtmlContent(rawHtml);
        
        if (cleanedText.length < 100) {
            throw new Error("Nội dung trang web quá ngắn hoặc không thể đọc được.");
        }
        
        return cleanedText;
    } catch (e) {
        console.error("Scanning error:", e);
        throw e;
    }
};

// Base schema for tags to be used in multiple functions
const tagsSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
    description: "Generate 3-5 short topic tags (e.g., 'History', 'Math', 'Vocabulary') to categorize this content."
};

/**
 * Helper to get Schema based on method
 */
const getSchemaForMethod = (method: string) => {
    switch (method) {
        case 'Flashcard':
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, catchy title for this study set" },
                    tags: tagsSchema,
                    flashcards: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                front: { type: Type.STRING, description: "The term or question" },
                                back: { type: Type.STRING, description: "The definition or answer" }
                            }
                        }
                    }
                }
            };
        case 'Quiz':
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    tags: tagsSchema,
                    quiz: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
                                explanation: { type: Type.STRING, description: "Why this answer is correct" }
                            }
                        }
                    }
                }
            };
        case 'Fill-in-the-blanks':
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    tags: tagsSchema,
                    fillInBlanks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sentence: { type: Type.STRING, description: "The sentence with the blank replaced by '_______'" },
                                answer: { type: Type.STRING, description: "The missing word or phrase" }
                            }
                        }
                    }
                }
            };
        case 'Spot the Error':
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    tags: tagsSchema,
                    spotErrors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                text: { type: Type.STRING, description: "The sentence containing the error" },
                                error: { type: Type.STRING, description: "Description of what is wrong" },
                                correction: { type: Type.STRING, description: "The corrected, factual sentence" }
                            }
                        }
                    }
                }
            };
        case 'Case Study':
            return {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    tags: tagsSchema,
                    caseStudies: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                scenario: { type: Type.STRING, description: "A short real-world scenario (2-3 sentences)" },
                                question: { type: Type.STRING, description: "A question asking to apply the concept" },
                                analysis: { type: Type.STRING, description: "The expert analysis/answer" }
                            }
                        }
                    }
                }
            };
        default:
            return {
                 type: Type.OBJECT,
                 properties: {
                     title: { type: Type.STRING },
                     tags: tagsSchema,
                     summary: { type: Type.STRING }
                 }
            };
    }
}

/**
 * Giai đoạn 2: Tạo nội dung học tập từ Text đã trích xuất
 */
export const generateLearningContent = async (
  processedContent: string,
  method: 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study'
): Promise<any> => {
  try {
    const finalContentToProcess = processedContent.substring(0, 100000); 
    const responseSchema = getSchemaForMethod(method);
    let systemInstruction = "";

    switch (method) {
        case 'Flashcard': systemInstruction = "Extract key concepts and create 8-12 flashcards."; break;
        case 'Quiz': systemInstruction = "Create exactly 12 multiple-choice questions."; break;
        case 'Fill-in-the-blanks': systemInstruction = "Create exactly 12 fill-in-the-blank exercises."; break;
        case 'Spot the Error': systemInstruction = "Create exactly 12 error spotting exercises."; break;
        case 'Case Study': systemInstruction = "Create exactly 12 mini case studies."; break;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this content and generate ${method}:\n\n${finalContentToProcess}`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

/**
 * Feature: Vision Alchemy
 * Generates learning content directly from an image (base64)
 */
export const generateContentFromImage = async (
    imageBase64: string,
    method: 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study'
): Promise<any> => {
    try {
        const responseSchema = getSchemaForMethod(method);
        
        // Convert base64 data URL to simple base64 string if needed
        const base64Data = imageBase64.split(',')[1] || imageBase64;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg', // Assuming jpeg/png, Gemini handles standard image types well
                            data: base64Data
                        }
                    },
                    {
                        text: `Analyze this image (diagram, text, or scene) and generate educational content in the format of: ${method}. If there is text, use it. If it's a diagram, explain the components.`
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No data returned from Image Analysis");
    } catch (error) {
        console.error("Error generating content from image:", error);
        throw error;
    }
}

/**
 * Feature: AI Pathfinder
 * Analyzes the graph and suggests a learning path
 */
export const generateLearningPath = async (
    targetNodeTitle: string,
    allNodesContext: string
): Promise<string[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `I have a knowledge graph with the following nodes (Format: ID - Title - Tags):
            ${allNodesContext}
            
            My goal is to master the node: "${targetNodeTitle}".
            
            Based on logical progression and prerequisites, select a sequence of existing Node IDs that I should study to reach this goal. Start from the most fundamental.
            
            Return ONLY a JSON array of Node IDs strings. Example: ["id1", "id2", "id3"].`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Pathfinding error:", error);
        return [];
    }
}

/**
 * Feature: Refinement Crucible
 * Allows refining existing JSON content (Simplify, Translate, Deepen)
 */
export const refineLearningContent = async (
    currentData: any, 
    refinementType: 'Simplify' | 'Translate' | 'Deepen' | 'Add Examples'
): Promise<any> => {
    try {
        const jsonString = JSON.stringify(currentData);
        let prompt = "";

        if (refinementType === 'Simplify') {
            prompt = "Simplify the language and concepts in this JSON content to make it easier for a beginner to understand. Keep the same JSON structure.";
        } else if (refinementType === 'Translate') {
            prompt = "Translate all 'front', 'back', 'question', 'explanation', 'sentence', 'answer', 'text', 'error', 'correction', 'scenario', 'analysis', and 'title' fields to Vietnamese. Keep the same JSON structure.";
        } else if (refinementType === 'Deepen') {
            prompt = "Add more depth and detail to the 'explanation', 'analysis', or 'back' fields. Make the questions slightly harder or more comprehensive. Keep the same JSON structure.";
        } else if (refinementType === 'Add Examples') {
            prompt = "Where appropriate (explanations or analyses), add a short real-world example. Keep the same JSON structure.";
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Refine the following JSON content based on this instruction: "${prompt}"\n\nJSON:\n${jsonString}`,
            config: {
                responseMimeType: "application/json"
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("Refinement failed");
    } catch (error) {
        console.error("Error refining content:", error);
        throw error;
    }
};

/**
 * Feature: Nano Banana Powered App - Image Generation
 * Uses gemini-3-pro-image-preview for high quality cover images
 */
export const generateCoverImage = async (prompt: string, aspectRatio: string = "16:9"): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [
                    { text: `Create a high quality, artistic, educational illustration for a study topic about: ${prompt}. Style: Digital Art, Vibrant, Educational.` }
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio as any, 
                    imageSize: "1K"
                }
            }
        });

        // Loop parts to find image
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
};

/**
 * Feature: Think More When Needed - Deep Analysis
 * Uses gemini-3-pro-preview with thinking budget
 */
export const deepAnalyzeContent = async (context: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Please perform a deep, structural analysis of the following educational content. 
            Identify hidden connections, underlying mental models, and potential contradictions.
            
            Content Context:
            ${context}`,
            config: {
                thinkingConfig: { thinkingBudget: 16000 } // Allocate thinking budget
            }
        });
        
        return response.text || "Analysis failed.";
    } catch (error) {
        console.error("Deep analysis failed:", error);
        return "Sorry, I couldn't perform the deep analysis at this time.";
    }
}

/**
 * Feature: Knowledge Compass - Suggest Hidden Connections
 * Analyzes nodes to find semantic links
 */
export const suggestHiddenConnections = async (allNodesContext: string): Promise<{source: string, target: string, reason: string}[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze these knowledge nodes (ID - Title - Tags):
            ${allNodesContext}
            
            Identify 3-5 non-obvious, semantic connections between nodes that do not share tags but have related concepts.
            Return JSON array: [{ "source": "id_a", "target": "id_b", "reason": "short reason" }]`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.STRING },
                            target: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        return [];
    } catch (error) {
        console.error("Hidden connections error:", error);
        return [];
    }
}
