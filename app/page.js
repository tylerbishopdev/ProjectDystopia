"use client";

import { useState, useEffect, useRef } from "react";
import Form from "./components/Form";
import Image from "next/image";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const promptInputRef = useRef(null);

  useEffect(() => {
    promptInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch(`/api/predictions/${prediction.id}`);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-5">
      <h1 className="py-6 italic font-extrabold tracking-tighter text-center  text-6xl">
        "...I would never want a book's autograph"
        <a
          href="https://replicate.com/stability-ai/sdxl?utm_source=project&utm_project=getting-started"
          className="font-extra-bold tracking-tight not-italic text-green-500"
        >
          <br />- Kanye West
        </a>
      </h1>

      <form onSubmit={handleSubmit} className="mt-5">
        <input
          ref={promptInputRef}
          type="text"
          name="prompt"
          placeholder="Enter a prompt..."
          className="input"
          required
          autoFocus
        />
        <button className="button" type="submit">
          Go!
        </button>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <>
          {prediction.output && (
            <div className="image-wrapper mt-5">
              <Image
                fill
                src={prediction.output[prediction.output.length - 1]}
                alt="output"
                sizes="100vw"
              />
            </div>
          )}
          <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
          <Form>
            <input faceUrl={prediction?.output?.[0]}>{faceUrl}</input>
            audioUrl={e.target.audioUrl.value}
            audioDuration={Number(e.target.audioDuration.value)}
          </Form>
        </>
      )}
    </div>
  );
}
