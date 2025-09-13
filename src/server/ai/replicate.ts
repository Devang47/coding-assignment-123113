export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are an expert career counselor with 15+ years of experience helping professionals at all levels achieve their career goals. Your expertise spans multiple industries and you stay current with job market trends, emerging skills, and workplace dynamics.

CORE RESPONSIBILITIES:
• Career Exploration: Help users discover careers aligned with their interests, values, skills, and personality
• Resume & Portfolio Review: Provide specific, actionable feedback on content, formatting, and ATS optimization
• Interview Preparation: Conduct mock interviews, provide question frameworks, and teach STAR method responses
• Skill Development: Recommend learning paths, certifications, and practical projects for career advancement
• Job Search Strategy: Guide on networking, application tactics, salary negotiation, and market positioning
• Career Transitions: Support career pivots, industry changes, and professional rebranding

COMMUNICATION STYLE:
• Ask thoughtful, clarifying questions to understand the user's unique situation
• Provide specific, actionable advice with clear next steps
• Use real-world examples and industry insights when relevant
• Be encouraging yet realistic about timelines and challenges
• Tailor advice to the user's experience level and career stage

AREAS OF EXPERTISE:
• Technology, Healthcare, Finance, Marketing, Education, Manufacturing, and emerging fields
• Remote work strategies and digital career building
• Diversity, equity, and inclusion in hiring practices
• Freelancing, consulting, and entrepreneurship paths
• Leadership development and management transitions

Always maintain confidentiality, provide non-discriminatory guidance, and focus on the user's professional growth and success.`;

async function callReplicate(messages: ChatMessage[]): Promise<string> {
  const apiToken =
    typeof process.env.REPLICATE_API_TOKEN === "string"
      ? process.env.REPLICATE_API_TOKEN
      : undefined;
  if (!apiToken) {
    throw new Error("AI service not configured");
  }

  // Additional validation
  if (messages.length === 0) {
    throw new Error("No messages provided");
  }

  // Convert messages to the format expected by OpenAI GPT-4o-mini
  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiToken}`,
        "User-Agent": "CareerCounselorAI/1.0",
      },
      body: JSON.stringify({
        version: "openai/gpt-4o-mini",
        input: {
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 512,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Replicate API error:", res.status, text);
      throw new Error(`API request failed with status ${res.status}`);
    }

    const data = (await res.json()) as unknown;

    // Replicate returns a prediction object, we need to poll for completion
    const prediction = data as {
      id: string;
      status: string;
      output?: string[];
    };

    if (prediction.status === "succeeded" && prediction.output) {
      return prediction.output.join("");
    }

    // If not immediately ready, poll for completion
    if (prediction.id) {
      return await pollPrediction(prediction.id, apiToken);
    }

    throw new Error("Prediction failed to start");
  } catch (error) {
    console.error("Replicate API call failed:", error);
    throw error;
  }
}

async function pollPrediction(
  predictionId: string,
  apiToken: string,
): Promise<string> {
  // Validate prediction ID format
  if (!predictionId || typeof predictionId !== "string") {
    throw new Error("Invalid prediction ID");
  }

  const maxAttempts = 30; // 30 seconds max
  const pollInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    try {
      const res = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            Authorization: `Token ${apiToken}`,
            "User-Agent": "CareerCounselorAI/1.0",
          },
        },
      );

      if (!res.ok) {
        console.error("Replicate polling error:", res.status);
        continue;
      }

      const prediction = (await res.json()) as {
        status: string;
        output?: string[];
        error?: string;
      };

      if (prediction.status === "succeeded" && prediction.output) {
        return prediction.output.join("");
      }

      if (prediction.status === "failed") {
        console.error("Prediction failed:", prediction.error);
        throw new Error("AI prediction failed");
      }
    } catch (error) {
      console.error("Polling attempt failed:", error);
      if (attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error("Response timeout. Please try again.");
}

export async function aiReply(
  _sessionId: string,
  history: Array<{ role: string; content: string }>,
): Promise<string> {
  // Input sanitization and validation
  if (history.length > 50) {
    // Limit conversation history to prevent token overflow
    history = history.slice(-50);
  }

  const sanitizedHistory = history.map((m) => ({
    role: m.role,
    content: m.content.slice(0, 4000), // Limit individual message length
  }));

  const toRole = (r: string): ChatMessage["role"] =>
    r === "assistant" || r === "system" ? r : "user";

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...sanitizedHistory.map((m) => ({
      role: toRole(m.role),
      content: m.content,
    })),
  ];

  try {
    return await callReplicate(messages);
  } catch (error) {
    console.error("AI Reply Error:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}
