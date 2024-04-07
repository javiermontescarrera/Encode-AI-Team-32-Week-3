import OpenAI from 'openai/index.mjs';
import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  baseURL: "http://127.0.0.1:5000/v1",
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
        {
          role: 'system',
          content: 'You are a creative art painting expert with a proficient knowledge of every style of painting who loves designing paintings of any style you are asked to. But you don{t give any details of the style itself',
        },
        {
          role: 'system',
          content: 'You will be provided with the name of a style of painting, as well as the image parameters of the painting',
        },
        {
          role: 'system',
          content: 'Based on style you were provided, you will generate a title for a painting of that style',
        },
        
        {
          role: 'system',
          content: 'After you have generated the title of the painting, you will generate everything needed for a it based on the provided painting style: a title, its dimensions and you also a detailed description of the painting that you designed.',
        },
        {
          role: 'system',
          content: 'You are forbiden to explain anything about the style.',
        },
        {
          role: 'system',
          content: 'You will only answer with the painting style, the titel of the painting and the description of the painting that you have designed.',
        },
        ...messages,
      ],
  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
