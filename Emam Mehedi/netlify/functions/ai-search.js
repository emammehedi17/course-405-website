// Import the Google AI SDK
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Your website's content. For now, we'll keep it simple.
// A better long-term solution is to read this from a shared JSON file.
const websiteContent = `
    Poem: أخي (My Brother) by Mikhail Naimy. A post-war poem about loss, sorrow, and the devastation of conflict. The speaker contrasts the victory celebrations of the West with the grim reality of his people, who have lost everything to hunger and war. The poem ends with the speaker digging graves for both the dead and the living, symbolizing complete despair.

    Poem: النهر المتجمد (The Frozen River) by Mikhail Naimy. The poem personifies a frozen river, comparing its current stillness to its past vibrancy. The poet then parallels the river's state with his own heart, which has become frozen with hopelessness and numb to both joy and sorrow. The river will thaw in the spring, but the poet's heart may not.
    
    Poem: العنقاء (The Phoenix) by Iliya Abu Madi. A symbolic search for an ultimate, perfect truth or happiness (the Phoenix). The poet searches everywhere—in nature, palaces, and even within himself through asceticism—but fails. He finally finds this truth in his own tears of sorrow and realizes the thing he was chasing was with him all along, but the realization comes too late to be useful.
`;

// The main function that Netlify will run
exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the user's question from the request
    const { query } = JSON.parse(event.body);
    
    // Access your secret API key from the environment variable
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt for the AI
    const prompt = `
        You are a helpful assistant for a poetry website. 
        Answer the user's question based ONLY on the following context. 
        If the answer is not in the context, say "I can't answer that based on the provided materials."

        Context:
        ${websiteContent}

        User's Question:
        ${query}
    `;

    // Ask the AI for an answer
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnswer = response.text();

    // Send the AI's answer back to the website
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiAnswer }),
    };
  } catch (error) {
    // Handle any errors
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};