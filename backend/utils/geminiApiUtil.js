const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Gemini APIのリクエストを送信する関数
async function geminiAPIRequest(promptText) {
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: promptText
                    }
                ]
            }
        ]
    };

    const apiUrlWithKey = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

    try {
        const response = await axios.post(apiUrlWithKey, requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const compliment = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return compliment;
    } catch (error) {
        console.error('Gemini API エラー:', error.response?.data || error.message);
        throw new Error('Gemini API リクエストに失敗しました');
    }
}

module.exports = {
    geminiAPIRequest
};