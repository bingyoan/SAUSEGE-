import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Ensure this route is always server-rendered and never pre-generated
export const dynamic = 'force-dynamic';

// Zod Schema for Request Validation
const GenerateSchema = z.object({
    model: z.string().min(1, 'Model is required'),
    contents: z.object({
        parts: z.array(z.any())
    }),
    config: z.object({
        responseMimeType: z.string().optional(),
        responseSchema: z.any().optional(),
        systemInstruction: z.string().optional()
    }).optional()
});

export async function POST(req: Request) {
    console.log(`[API Proxy] Received request at ${new Date().toISOString()}`);
    try {
        // 1. STRICT BYOK CHECK (Request Header)
        const apiKey = req.headers.get('x-custom-api-key');
        console.log(`[API Proxy] API Key provided: ${apiKey ? 'Yes (starts with ' + apiKey.substring(0, 4) + ')' : 'No'}`);

        if (!apiKey || !apiKey.startsWith('AIza')) {
            return NextResponse.json({ error: 'Missing or Invalid API Key (BYOK Required)' }, { status: 401 });
        }

        // 2. INPUT VALIDATION
        const rawBody = await req.json();
        console.log(`[API Proxy] Request body model: ${rawBody.model}`);

        const parseResult = GenerateSchema.safeParse(rawBody);

        if (!parseResult.success) {
            console.error(`[API Proxy] Validation Failed:`, parseResult.error.flatten());
            return NextResponse.json({
                error: 'Invalid request body',
                details: parseResult.error.flatten()
            }, { status: 400 });
        }

        const { model, contents, config } = parseResult.data;

        // 3. EXECUTE GEMINI REQUEST
        console.log(`[API Proxy] Calling Google GenAI SDK...`);
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // If the newer getGenerativeModel style fails, we might need to revert or use the models namespace
        // based on the specific version of @google/genai installed.
        // Let's use the namespace style as it was present in the original (presumably working) logic.
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: config
        });

        console.log(`[API Proxy] SDK Success`);
        return NextResponse.json({
            text: response.text,
            usageMetadata: response.usageMetadata
        });

    } catch (err: any) {
        console.error("[API Proxy] Error:", err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
