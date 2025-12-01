
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper: Fetch content from URL using a CORS proxy with fallback
const fetchUrlContent = async (url: string): Promise<string> => {
  // Danh sách các Proxy để dự phòng nếu cái này lỗi thì dùng cái kia
  const proxies = [
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
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a friendly, encouraging AI tutor for LearnAI. You help users learn languages and subjects using the Socratic method and spaced repetition concepts. Keep answers concise, helpful, and motivating.",
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

/**
 * Giai đoạn 2: Tạo nội dung học tập từ Text đã trích xuất
 */
export const generateLearningContent = async (
  processedContent: string,
  method: 'Flashcard' | 'Quiz' | 'Fill-in-the-blanks' | 'Spot the Error' | 'Case Study'
): Promise<any> => {
  try {
    // Cắt bớt nội dung nếu quá dài (Gemini 2.5 chịu được khoảng 1M token, nhưng an toàn là trên hết cho demo)
    const finalContentToProcess = processedContent.substring(0, 100000); 

    let systemInstruction = "";
    let responseSchema: any = {};

    switch (method) {
        case 'Flashcard':
            systemInstruction = "You are a content alchemist. Extract key concepts from the provided text and create a set of 8-12 high-quality flashcards. Return ONLY valid JSON.";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A short, catchy title for this study set" },
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
            break;

        case 'Quiz':
            systemInstruction = "You are a professional examiner. Create a challenging multiple-choice quiz with EXACTLY 12 questions based on the provided text. Ensure distractors are plausible.";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
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
            break;

        case 'Fill-in-the-blanks':
            systemInstruction = "You are a language teacher. Create EXACTLY 12 'Fill-in-the-blanks' exercises based on the text. Select key terms or important facts to be the blanks. The sentence should provide enough context.";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
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
            break;

        case 'Spot the Error':
            systemInstruction = "You are a critical thinking coach. Create EXACTLY 12 items. For each item, take a fact from the text and slightly alter it to create a subtle factual or logical error. The user must find this error.";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
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
            break;

        case 'Case Study':
            systemInstruction = "You are a professor. Create EXACTLY 12 mini-case scenarios or applied questions based on the concepts in the text. Each item should present a short real-world situation and ask for analysis.";
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
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
            break;

        default:
            systemInstruction = "Summarize the content.";
            responseSchema = {
                 type: Type.OBJECT,
                 properties: {
                     title: { type: Type.STRING },
                     summary: { type: Type.STRING }
                 }
            };
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze this content and generate ${method} (Target: 12 items if applicable):\n\n${finalContentToProcess}`,
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
