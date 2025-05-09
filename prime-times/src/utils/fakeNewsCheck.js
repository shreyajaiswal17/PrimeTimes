export const checkFakeNews = async (text) => {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/fact-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    return data.result || "❓ Unable to determine authenticity.";
  } catch (error) {
    console.error("Error in fake news check:", error);
    return "❌ Error connecting to fact-check service.";
  }
};
