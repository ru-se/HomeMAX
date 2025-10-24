const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// APIバージョンを v1 に、モデル名を gemini-pro に変更
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent'; // <- バージョンとモデル名を変更

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

    try {
        const response = await axios.post(GEMINI_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
        });

        const compliment = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        // レスポンスが空でないか確認
        if (!compliment) {
            console.error('Gemini APIからのレスポンスが空、または予期しない形式です:', response.data);
            throw new Error('Gemini APIからの応答が空です');
        }
        return compliment;
    } catch (error) {
        console.error('Gemini API エラー:', error.response?.data || error.message);
        if (error.response && error.response.data && error.response.data.error) {
            console.error('エラー詳細:', error.response.data.error.message);
        }
        // 404エラーの場合は、モデルが見つからないことを示唆するメッセージを追加
        if (error.response && error.response.status === 404) {
             throw new Error(`Gemini API リクエスト失敗: モデル '${GEMINI_API_URL.split('/')[5].split(':')[0]}' が見つかりません。利用可能なモデルを確認してください。`);
        }
        throw new Error('Gemini API リクエストに失敗しました');
    }
}

module.exports = {
    geminiAPIRequest
};