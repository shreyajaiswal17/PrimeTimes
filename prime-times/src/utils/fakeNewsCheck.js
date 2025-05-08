import axios from "axios";

const HF_API_TOKEN = import.meta.env.VITE_HF_API_TOKEN;

export const checkFakeNews = async (text) => {
  try {
    
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-fake-news-detection",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      }
    );
    console.log("API response:", response.data);


    const result = response.data[0];
    const label = result.label;
    const score = (result.score * 100).toFixed(2);

    return label === "LABEL_1"
      ? `⚠️ Likely Fake News (${score}%)`
      : `✅ Likely Real News (${score}%)`;
  } catch (error) {
    console.error("Fake news check failed:", error);
    return "❓ Unable to verify authenticity.";
  }
};
