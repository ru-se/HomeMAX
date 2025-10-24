const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// URLから ?key= を削除し、モデル名を指定
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'; // <- モデル名とバージョンを修正

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

    // APIキーはURLではなくヘッダーで渡す
    // const apiUrlWithKey = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`; // <- この行は削除

    try {
        // axios.postの第3引数 (config) の headers に API キーを追加
        const response = await axios.post(GEMINI_API_URL, requestBody, { // <- URLを修正
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY // <- ヘッダーにAPIキーを追加
            },
        });

        const compliment = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        return compliment;
    } catch (error) {
        console.error('Gemini API エラー:', error.response?.data || error.message);
        // エラーレスポンスの内容をより詳細に出力
        if (error.response && error.response.data && error.response.data.error) {
            console.error('エラー詳細:', error.response.data.error.message);
        }
        throw new Error('Gemini API リクエストに失敗しました');
    }
}

module.exports = {
    geminiAPIRequest
};