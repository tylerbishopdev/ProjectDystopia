import React, { useState } from "react";

const Form = ({ model }) => {
  const [faceUrl, setFaceUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const replicate = new Replicate({
        auth: process.env.REPLICATE_API_TOKEN,
        userAgent: "https://www.npmjs.com/package/create-replicate",
      });

      const input = {
        face: faceUrl,
        input_audio: audioUrl,
        audio_duration: parseInt(audioDuration),
      };

      console.log("With input: %O", input);

      console.log("Running...");
      const output = await replicate.run(model, { input });
      console.log("Done!", output);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Face URL"
        value={faceUrl}
        onChange={(e) => setFaceUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Input Audio URL"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
      />
      <input
        type="number"
        placeholder="Audio Duration"
        value={audioDuration}
        onChange={(e) => setAudioDuration(e.target.value)}
      />
      <button type="submit">Run Model</button>
    </form>
  );
};

export default Form;
