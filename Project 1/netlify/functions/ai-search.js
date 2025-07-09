// Import the Google AI SDK to communicate with the Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");

// This constant holds all the knowledge for the AI.
// It's a detailed, descriptive summary of your entire website's content.
const websiteContent = `
--- WEBSITE OVERVIEW ---
This website, "The Class Caddy," is a dedicated study resource for students of the University of Dhaka, created by Emam Mehedi. It covers materials for several courses, primarily focusing on Course 405 (Modern Arabic Poetry) and Course 408(B) (Research Methodology). The site provides detailed analyses and translations of poems, downloadable notes for various courses, and a comprehensive guide to research principles.

--- COURSE 405: MODERN ARABIC POETRY ---
This course covers six modern Arabic poems. Four are taught by Ruhul Amin Sir and two by Fozlur Rahman Sir.

**Poems Taught by Ruhul Amin Sir:**

1.  **Poem: أخي (Akhi / My Brother)**
    * **Poet:** Mikhail Naimy (ميخائيل نعيمة).
    * **Theme:** This is a deeply sorrowful post-war poem exploring the themes of loss, despair, and the hollowness of victory. The speaker addresses his "brother" (a symbol for his people), urging him not to celebrate the triumphs of the West, because their own reality is one of utter devastation. The war has left them with nothing but hunger, death, and shame. The poem's powerful conclusion suggests that their suffering is so complete that they must dig graves not only for the dead but also for themselves, the living, who have lost all hope and dignity.

2.  **Poem: النهر المتجمد (An-Nahr al-Mutajammid / The Frozen River)**
    * **Poet:** Mikhail Naimy (ميخائيل نعيمة).
    * **Theme:** The poem uses the powerful metaphor of a frozen river to symbolize the poet's own heart, which has become emotionally numb and stagnant due to immense sorrow and hopelessness. The speaker contrasts the river's current silent, frozen state with its past life and vibrancy. He then draws a parallel to his own heart, which can no longer feel joy, pain, or hope. The poem ends on a tragic note: while the river will eventually thaw and flow again with the arrival of spring, the poet feels his own emotional paralysis is permanent.

3.  **Poem: أغمض جفونك تبصر (Aghmid Jufunaka Tubsir / Close Your Eyes and You Will See)**
    * **Poet:** Mikhail Naimy (ميخائيل نعيمة).
    * **Theme:** This is a philosophical and optimistic poem about the power of inner vision and faith over superficial reality. The poet argues that true understanding and hope are found by looking beyond what is immediately visible. He uses examples like seeing stars behind clouds, or imagining green meadows under a blanket of snow. The central message is that even in the face of disease or death, a deeper truth and a form of continuation ("the cradle of life" in the grave) can be perceived through spiritual insight.

4.  **Poem: عصفور الجنة (Usfur al-Jannah / The Bird of Paradise)**
    * **Poet:** Abd al-Rahman Shukri (عبد الرحمن شكري).
    * **Theme:** The poem is a romantic address to a beautiful bird, which symbolizes purity, nature, and true art. The poet invites the bird into his heart, which he describes as a welcoming garden. He sees the bird's song as a form of pure, honest poetry, contrasting it with the deceit and corruption of humanity. The poem explores themes of beauty, disillusionment with society, and the search for a sanctuary in nature and art.

**Poems Taught by Fozlur Rahman Sir:**

5.  **Poem: العنقاء (Al-'Anqa' / The Phoenix)**
    * **Poet:** Iliya Abu Madi (إيليا ابو ماضي).
    * **Theme:** A profound symbolic poem about the human quest for an unattainable ideal, whether it be perfect happiness, absolute truth, or ultimate beauty. This ideal is represented by the mythical Phoenix ('Anqa'). The poet describes his lifelong, exhaustive search in every possible place—nature, society, and even within himself through asceticism—only to be met with failure and confusion. In a moment of ultimate despair, he finally finds the 'Anqa' in his own tears, realizing that the truth and beauty he sought were internal all along. However, this profound realization comes too late to be of practical use, highlighting a tragic irony.

6.  **Poem: إِناءٌ (Ina' / A Vessel)**
    * **Poet:** Elias Abu Shabaki (إلياس أبو شبكة).
    * **Theme:** A powerful allegory about the rejection of pure love, compassion, and justice by a materialistic and hypocritical society. The poet's heart is a "vessel" (Ina') filled with the "wine" of these pure emotions. He offers this vessel to every segment of society: the poor (who find it impractical), the rulers (who see it as forbidden), the prisoners (who demand legal change, not feelings), the wise (who dismiss it as foolish), and fellow poets (who are too self-absorbed). After being rejected by everyone, the poet retreats into solitude and drinks from his own vessel, discovering that this self-contained love, though unappreciated by the world, is the true source of his dignity and inner peace.

--- COURSE 406: DOWNLOADS ---
This section provides download links for course materials from different instructors.
* **Ehsan Sir:** Materials available for download include "Translation" and "Collocation."
* **Nure Alam Sir:** Materials available for download include "Translation."

--- COURSE 407: DOWNLOADS ---
This section provides materials for two instructors.
* **Imran Sir:** A "Note on all slides" is available for download. The slides themselves are not directly downloadable from this link.
* **Naimul Islam Sir:** A "Complete Note" is available for download.

--- COURSE 408(B): RESEARCH METHODOLOGY ---

**1. What is Research?**
* Research is defined as a systematic, controlled, empirical, and critical investigation into natural phenomena. It is guided by theory and hypotheses. It is a structured process of inquiry used to collect and analyze information to increase understanding of a topic, discover new facts, or revise existing theories.

**2. Common Sense vs. Research:**
* This section contrasts everyday common sense with formal research. Common sense is based on individual, personal experiences and doesn't require formal evidence. Research, on the other hand, is based on the collective experiences of many people (often a representative sample), requires verifiable data, follows a rigorous and transparent methodology, and its findings can be used for prediction and policy formulation.

**3. Types of Research:**
* **By Objectives:**
    * **Descriptive:** Aims to accurately describe the characteristics of a particular individual, situation, or group.
    * **Exploratory:** Conducted for a problem that has not been clearly defined, helping to gain a better understanding of it.
    * **Explanatory:** Seeks to explain the 'why' behind a phenomenon, focusing on cause-and-effect relationships.
    * **Hypothesis-Testing:** Designed specifically to test a hypothesis of a causal relationship between variables.
* **By Outcome/Application:**
    * **Fundamental (or Basic/Pure) Research:** Driven by a scientist's curiosity or interest in a scientific question. The main motivation is to expand knowledge, not to create or invent something.
    * **Applied (or Action) Research:** Designed to solve practical problems of the modern world, rather than to acquire knowledge for knowledge's sake.
* **By Inquiry Mode:**
    * **Quantitative:** Focuses on numerical data and statistical, mathematical, or computational analysis.
    * **Qualitative:** Focuses on non-numerical data, such as text, video, or audio, to understand concepts, opinions, or experiences.
    * **Mixed Methods:** A research approach that combines both quantitative and qualitative forms.
* **By Concept:**
    * **Conceptual:** Research related to some abstract idea(s) or theory. It is generally used by philosophers and thinkers to develop new concepts or to reinterpret existing ones.
    * **Empirical:** Research that relies on experience or observation alone, often without due regard for system and theory. It is data-based research.

**4. The Research Process:**
* This is a series of sequential steps:
    1.  Define Research Problem
    2.  Review the Literature
    3.  Formulate Hypothesis
    4.  Design Research (including sample design)
    5.  Collect Data
    6.  Analyze Data
    7.  Interpret and Report the findings.

**5. Research Design:**
* This is the overall plan, blueprint, or strategy for conducting the research. It is the framework that holds all of the elements in a research project together. It is distinct from research methods, which are the specific tools and procedures used to execute the plan (e.g., a survey, an interview, an experiment).

**6. Sampling:**
* Sampling is the process of selecting a subset of individuals from within a statistical population to estimate characteristics of the whole population.
* **Probability Sampling:** A sampling technique in which every member of the population has a known, non-zero chance of being selected. This method is crucial for making generalizations about the population. Types include Simple Random Sampling (SRS), Systematic Sampling, Stratified Sampling, and Cluster Sampling.
* **Non-Probability Sampling:** A sampling technique where the samples are gathered in a process that does not give all the individuals in the population equal chances of being selected. It relies on the subjective judgment of the researcher. Types include Convenience Sampling, Purposive Sampling, Quota Sampling, and Snowball Sampling.
`;


// This is the main serverless function that Netlify will run.
// It receives the user's question, sends it to the Google AI with the context above, and returns the answer.
exports.handler = async function (event) {
  // We only want to handle POST requests from our website
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the user's question from the request body
    const { query } = JSON.parse(event.body);
    
    // Access your secret API key from the environment variable set on Netlify
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the final prompt we will send to the AI
    const prompt = `
        You are a helpful and friendly assistant for "The Class Caddy," a study website for university students. 
        Your primary role is to answer the user's question based ONLY on the detailed context provided below.
        Do not use any external knowledge.
        If the answer is not found in the context, you MUST respond with: "I'm sorry, I can't answer that based on the provided materials."

        CONTEXT:
        ${websiteContent}

        USER'S QUESTION:
        ${query}
    `;

    // Send the prompt to the AI model and wait for the result
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnswer = response.text();

    // Send the AI's generated answer back to the website
    return {
      statusCode: 200,
      body: JSON.stringify({ answer: aiAnswer }),
    };
  } catch (error) {
    // If anything goes wrong, send back an error message
    console.error("Error in AI function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "There was an error processing your request." }) };
  }
};
