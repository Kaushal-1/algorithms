
const GROQ_API_KEY = "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";

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

export const callGroqApi = async (
  systemPrompt: string,
  userPrompt: string,
  previousMessages: Array<{ role: string; content: string }> = []
): Promise<string> => {
  try {
    console.log('Calling Groq API with prompt:', userPrompt.substring(0, 50) + '...');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...previousMessages,
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Groq API error [${response.status}]:`, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data: GroqResponse = await response.json();
    console.log('Groq API response received successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in callGroqApi:', error);
    throw error;
  }
};
