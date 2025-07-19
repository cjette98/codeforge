import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyDKRcf46xwoCcZa8atvo6lViYFnO5sX_1M";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const sanitizeJsonString = (str: string) => {
    // Find the first { and last } to extract valid JSON
    const start = str.indexOf("{");
    const end = str.lastIndexOf("}") + 1;
    if (start === -1 || end === 0) return null;

    // Extract the JSON part
    const jsonPart = str.slice(start, end);

    // Remove any invalid characters
    return jsonPart.replace(/[\x00-\x1F\x7F-\x9F]/g, "");
};

const parseResponse = (text: string) => {
    try {
        // First try direct parsing
        return JSON.parse(text);
    } catch (e) {
        // If direct parsing fails, try to sanitize and parse
        const sanitized = sanitizeJsonString(text);
        if (!sanitized) {
            throw new Error("Failed to extract valid JSON from response");
        }
        return JSON.parse(sanitized);
    }
};

export const answerLessonQuestion = async (
    lessonTitle: string,
    lessonContent: string,
    userQuestion: string
): Promise<{
    answer: string;
    relatedConcepts: string[];
    additionalResources: string[];
}> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are a helpful C++ programming tutor. A student is learning about "${lessonTitle}" and has asked a follow-up question.

Lesson Content Summary: ${lessonContent.substring(0, 1000)}...

Student's Question: ${userQuestion}

Please provide a helpful, educational response that:
1. Directly answers their question
2. Relates back to the lesson content
3. Uses simple, beginner-friendly language
4. Provides practical examples when relevant

Respond strictly in this JSON format without any additional text:
{
  "answer": "Provide a clear, detailed answer to the student's question with examples if helpful",
  "relatedConcepts": ["concept 1", "concept 2", "concept 3"],
  "additionalResources": ["resource suggestion 1", "resource suggestion 2"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return parseResponse(response.text());
    } catch (error) {
        console.error("Error in answerLessonQuestion:", error);
        throw new Error("Failed to get answer. Please try again.");
    }
};

export const generateSuggestedQuestions = async (
    lessonTitle: string,
    lessonContent: string
): Promise<{
    questions: string[];
}> => {
    try {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Based on this C++ lesson about "${lessonTitle}", generate 3-4 common follow-up questions that students might ask.

Lesson Content Summary: ${lessonContent.substring(0, 800)}...

Generate questions that:
1. Help clarify common confusing points
2. Ask for practical examples
3. Relate to real-world applications
4. Build on the lesson concepts

Respond strictly in this JSON format without any additional text:
{
  "questions": ["question 1", "question 2", "question 3", "question 4"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return parseResponse(response.text());
    } catch (error) {
        console.error("Error in generateSuggestedQuestions:", error);
        throw new Error("Failed to generate suggested questions. Please try again.");
    }
};