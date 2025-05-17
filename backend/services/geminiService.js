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
    const prompt = `「仕事、恋愛、人間関係、趣味、生活のこと、愚痴、目標、健康、メンタル、自分自身のこと、将来のこと、社会のこと」この要素の中から当てはまるものを、次の文章から抜き出してください。そして抜き出した要素のみ「、」で区切って。：「${message}」`;
    try {
        const response = await geminiAPIRequest(prompt);
        return response;
    } catch (error) {
        console.error('Gemini サービスのポジティブ要素抽出エラー:', error);
        throw error;
    }
};