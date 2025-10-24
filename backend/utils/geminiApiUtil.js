const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// 利用可能なモデル名 'gemini-pro-latest' を指定
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent'; // <- モデル名を修正

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

    try {
        // axios.postの第3引数 (config) の headers に API キーを追加
        const response = await axios.post(GEMINI_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY // ヘッダーでAPIキーを渡す
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
        // エラーレスポンスの内容をより詳細に出力
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