import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI configuration (optional - app works with fallback stories)
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Initialize Gemini AI only if API key is available
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

if (apiKey && apiKey !== '') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
  } catch (error) {
    console.log('Gemini AI not configured, using fallback stories');
  }
}

// Story generation configuration
const storyGenerationConfig = {
  temperature: 0.8,
  maxOutputTokens: 1000,
  topP: 0.8,
  topK: 40,
};

export interface StoryRequest {
  words: string[];
  language: 'bangla' | 'english';
  childAge?: number;
  storyLength?: 'short' | 'medium' | 'long';
  theme?: 'adventure' | 'friendship' | 'learning' | 'fun';
}

export interface StoryResponse {
  title: string;
  content: string;
  moral?: string;
  vocabulary?: string[];
  questions?: string[];
}

// Fallback story templates for when API is not available
const fallbackStories = {
  english: [
    {
      title: "The Adventure of {word1} and {word2}",
      content: "Once upon a time, there was a {word1} who loved to {word3}. One day, the {word1} met a {word2} at the {word4}. They became best friends and decided to {word3} together every day. They had so much fun and learned that friendship makes everything better!",
      moral: "True friendship makes every adventure better!",
      vocabulary: ["adventure", "friendship", "together", "happiness"],
      questions: ["Who did the {word1} meet?", "What did they do together?", "What did they learn about friendship?"]
    },
    {
      title: "A Day with {word1}",
      content: "In a beautiful {word4}, there lived a happy {word1}. Every morning, the {word1} would wake up and see a {word2}. The {word1} loved to {word3} with joy. One special day, something amazing happened - the {word1} discovered that being kind and {word3} brought happiness to everyone around!",
      moral: "Kindness and joy spread happiness everywhere!",
      vocabulary: ["happiness", "discovery", "kindness", "special"],
      questions: ["Where did the {word1} live?", "What made the day special?"]
    }
  ],
  bangla: [
    {
      title: "{word1} এবং {word2} এর গল্প",
      content: "একদিন এক {word1} ছিল যে {word3} করতে পছন্দ করত। একদিন {word1} একটি {word2} কে {word4} এ দেখল। তারা দুজন একসাথে {word3} করতে লাগল এবং খুব আনন্দিত হল। তারা শিখল যে একসাথে থাকলে সব কিছু আরও মজার হয়!",
      moral: "বন্ধুত্ব সবকিছু সুন্দর করে তোলে!",
      vocabulary: ["বন্ধুত্ব", "আনন্দ", "একসাথে", "মজা"],
      questions: ["{word1} কি করতে পছন্দ করত?", "তারা কি শিখল?"]
    }
  ]
};

function generateFallbackStory(words: string[], language: 'bangla' | 'english'): StoryResponse {
  const templates = fallbackStories[language];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  let title = template.title;
  let content = template.content;
  let questions = [...template.questions];
  
  // Replace placeholders with actual words
  words.forEach((word, index) => {
    const placeholder = `{word${index + 1}}`;
    title = title.replace(new RegExp(placeholder, 'g'), word);
    content = content.replace(new RegExp(placeholder, 'g'), word);
    questions = questions.map(q => q.replace(new RegExp(placeholder, 'g'), word));
  });
  
  return {
    title,
    content,
    moral: template.moral,
    vocabulary: template.vocabulary,
    questions
  };
}

export const geminiService = {
  // Generate story based on selected words
  generateStory: async (request: StoryRequest): Promise<StoryResponse> => {
    // If no API key, use fallback stories
    if (!model) {
      console.log('Using fallback story generation');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return generateFallbackStory(request.words, request.language);
    }
    
    try {
      const { words, language, childAge = 6, storyLength = 'medium', theme = 'fun' } = request;
      
      const languageInstruction = language === 'bangla' 
        ? 'Write the story in Bengali (Bangla) language. Use simple Bengali words appropriate for children.'
        : 'Write the story in English language. Use simple English words appropriate for children.';

      const lengthInstruction = {
        short: 'Keep the story short (3-4 sentences)',
        medium: 'Keep the story medium length (6-8 sentences)',
        long: 'Make the story longer (10-12 sentences)'
      }[storyLength];

      const prompt = `
        Create a children's story for a ${childAge}-year-old child with the following requirements:
        
        ${languageInstruction}
        
        Required words to include: ${words.join(', ')}
        
        Story theme: ${theme}
        ${lengthInstruction}
        
        Make the story:
        - Age-appropriate and educational
        - Fun and engaging
        - Include simple vocabulary
        - Have a positive message or moral lesson
        - Be suitable for reading aloud
        
        Please provide:
        1. A catchy title
        2. The story content
        3. A simple moral lesson (optional)
        4. 3-5 new vocabulary words from the story
        5. 2-3 simple questions about the story
        
        Format your response as JSON:
        {
          "title": "Story Title",
          "content": "Story content here...",
          "moral": "Simple moral lesson",
          "vocabulary": ["word1", "word2", "word3"],
          "questions": ["Question 1?", "Question 2?"]
        }
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: storyGenerationConfig,
      });

      const response = await result.response;
      const text = response.text();
      
      // Try to parse JSON response
      try {
        const parsedResponse = JSON.parse(text);
        return parsedResponse;
      } catch (parseError) {
        // If JSON parsing fails, return a structured response
        return {
          title: `Story with ${words.join(', ')}`,
          content: text,
          moral: 'Learning new words is fun!',
          vocabulary: words,
          questions: ['What was your favorite part of the story?', 'Can you tell me what happened?']
        };
      }
    } catch (error) {
      console.error('Error generating story, using fallback:', error);
      // Use fallback story if API fails
      return generateFallbackStory(request.words, request.language);
    }
  },

  // Generate learning content explanations
  generateExplanation: async (topic: string, language: 'bangla' | 'english', childAge: number = 6): Promise<string> => {
    if (!model) {
      return `Let's learn about ${topic} together!`;
    }
    
    try {
      const languageInstruction = language === 'bangla' 
        ? 'Explain in simple Bengali (Bangla)'
        : 'Explain in simple English';

      const prompt = `
        Explain "${topic}" for a ${childAge}-year-old child.
        
        ${languageInstruction}
        
        Make it:
        - Simple and easy to understand
        - Fun and engaging
        - Age-appropriate
        - Short (2-3 sentences)
        - Use examples children can relate to
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
          topP: 0.8,
          topK: 40,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating explanation:', error);
      return `Let's learn about ${topic} together!`;
    }
  },

  // Generate math word problems
  generateMathProblem: async (operation: 'addition' | 'subtraction' | 'multiplication' | 'division', difficulty: 'easy' | 'medium' | 'hard', language: 'bangla' | 'english' = 'english'): Promise<string> => {
    if (!model) {
      return `Let's practice ${operation}!`;
    }
    
    try {
      const languageInstruction = language === 'bangla' 
        ? 'Write the problem in Bengali (Bangla)'
        : 'Write the problem in English';

      const difficultyNumbers = {
        easy: 'numbers 1-10',
        medium: 'numbers 1-20',
        hard: 'numbers 1-50'
      };

      const prompt = `
        Create a simple ${operation} word problem for children.
        
        ${languageInstruction}
        
        Requirements:
        - Use ${difficultyNumbers[difficulty]}
        - Make it relatable to children (toys, animals, food, etc.)
        - Keep it simple and clear
        - One sentence problem
        - Age-appropriate language
        
        Example format: "Sarah has 5 apples. She gets 3 more apples. How many apples does she have now?"
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
          topP: 0.8,
          topK: 40,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating math problem:', error);
      return `Let's practice ${operation}!`;
    }
  },

  // Generate positive feedback messages
  generateEncouragement: async (achievement: string, language: 'bangla' | 'english' = 'english'): Promise<string> => {
    if (!model) {
      return language === 'bangla' ? 'ভালো কাজ! (Great job!)' : 'Great job! Keep it up!';
    }
    
    try {
      const languageInstruction = language === 'bangla' 
        ? 'Write in Bengali (Bangla)'
        : 'Write in English';

      const prompt = `
        Generate an encouraging message for a child who just achieved: "${achievement}"
        
        ${languageInstruction}
        
        Make it:
        - Positive and encouraging
        - Age-appropriate (5-8 years old)
        - Short (1-2 sentences)
        - Fun and exciting
        - Include celebration words
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 50,
          topP: 0.8,
          topK: 40,
        },
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating encouragement:', error);
      return language === 'bangla' ? 'ভালো কাজ! (Great job!)' : 'Great job! Keep it up!';
    }
  },
};

export default geminiService;
