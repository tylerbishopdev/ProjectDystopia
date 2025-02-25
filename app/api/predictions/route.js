import { NextResponse } from "next/server";
import Replicate from "replicate";
import dotenv from "dotenv";
dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Prevent Next.js / Vercel from caching responses
// See https://github.com/replicate/replicate-javascript/issues/136#issuecomment-1728053102
replicate.fetch = (url, options) => {
  return fetch(url, { ...options, cache: "no-store" });
};

// In production and preview deployments (on Vercel), the VERCEL_URL environment variable is set.
// In development (on your local machine), the NGROK_HOST environment variable is set.
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NGROK_HOST;

export async function POST(request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("The environment variable is not set.");
  }

  const { prompt } = await request.json();

  const options = {
    version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
    input: { prompt },
  };

  if (WEBHOOK_HOST) {
    options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
    options.webhook_events_filter = ["start", "completed"];
  }

  let prediction;
  try {
    prediction = await replicate.deployments.predictions.create(
      "tylerbishopdev",
      "remixshiba",
      {
        input: {
          face: faceUrl,
          input_audio: audioUrl,
          audio_duration: parseInt(audioDuration),
        },
      }
    );

    console.log("Using model: %s", "tylerbishopdev/remixshiba");
    console.log("With input: %O", input);

    console.log("Running...");
    const output = await replicate.run("tylerbishopdev/remixshiba", { input });
    console.log("Done!", output);
  } catch (error) {
    console.error("Error:", error);
  }

  return NextResponse.json(prediction, { status: 201 });
}
