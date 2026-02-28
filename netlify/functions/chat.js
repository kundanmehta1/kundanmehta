export default async (req) => {
  try {
    const body = JSON.parse(req.body || "{}");
    const userMessage = body.message || "";

    if (!userMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Message missing" })
      };
    }

    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    const data = await response.json();

    let reply = "Sorry, I couldn't answer that.";
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Server error" })
    };
  }
};
