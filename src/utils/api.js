export const apiKey = "AIzaSyCInHLdJ39gWfGJ88AvJSshcRGXO_cY5pw";

export async function fetchWithRetry(url, options, retries = 5) {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(res => setTimeout(res, delays[i]));
        }
    }
}

export async function generateGeminiText(prompt, systemInstruction) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    try {
        const data = await fetchWithRetry(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar la respuesta en este momento.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Hubo un error al contactar al oráculo de las cartas. Inténtalo más tarde.";
    }
}
