import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

export const runtime = "edge";
const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`;
const model = 'stabilityai/stable-diffusion-2-1';
// const model = 'stabilityai/stable-diffusion-2';
// const model = 'runwayml/stable-diffusion-v1-5';
// const model = 'prompthero/openjourney-v4';
// const model = 'nDimensional/Experience';

export async function POST(req: Request) {
  const { message } = await req.json();
  const prompt = `You are a very professional and versatile painter who can create any style of painting. You have to generate an painting following gracefully these instructions: ${message}`;
  const inputs = prompt.substring(0, Math.min(prompt.length, 5000));

  console.log(inputs);

  const response = await hf.textToImage({
    inputs: inputs,
    model: model,
    parameters: {
      negative_prompt: 'blurry',
    }
  });

  // console.log(`response.type: ${response.type}`)

  const buffer = Buffer.from(await response.arrayBuffer());
  const cadena = `"${buffer.toString('base64')}"`;
  // console.log(`Cadena: ${cadena}`);
  return new Response(cadena);
}