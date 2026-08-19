import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3.7-flash";

const GenerateInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const generateOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(MODEL),
      system: data.system,
      prompt: data.prompt,
    });
    return { text: await result.text };
  });

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured (missing API key).");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(MODEL),
      system:
        "You are a concise, professional workplace productivity assistant. Use markdown, short paragraphs and bullet points. Ask a clarifying question when the request is ambiguous.",
      messages: data.messages,
    });
    return { text: await result.text };
  });
