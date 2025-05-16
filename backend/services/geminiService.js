// services/geminiService.js
const { geminiAPIRequest } = require('../utils/geminiApiUtil');

// 褒め言葉生成
exports.generateCompliment = async (prompt) => {
    try {
        const response = await geminiAPIRequest(prompt);
        return response;
    } catch (error) {
        console.error('Gemini サービスの褒め言葉生成エラー:', error);
        throw error;
    }
};

// ポジティブ要素を抽出、分析用
exports.extractPositiveAspects = async (message) => {
    const prompt = `次の文章から褒めるべきポジティブな要素を簡潔に抜き出してください：「${message}」`;
    try {
        const response = await geminiAPIRequest(prompt);
        return response;
    } catch (error) {
        console.error('Gemini サービスのポジティブ要素抽出エラー:', error);
        throw error;
    }
};