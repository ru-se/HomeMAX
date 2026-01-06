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
    const prompt = `以下の文章から、次の要素リストのうち当てはまるものを抽出してください。\n要素リスト: [仕事, 恋愛, 人間関係, 趣味, 生活のこと, 愚痴, 目標, 健康, メンタル, 自分自身のこと, 将来のこと, 社会のこと]\n\n制約:\n- 該当する要素の単語のみをカンマ(,)区切りで出力してください。\n- 文章や説明は一切含めないでください。\n- 該当するものがない場合は「その他」とだけ出力してください。\n\n対象の文章:「${message}」`;
    try {
        const response = await geminiAPIRequest(prompt);
        return response;
    } catch (error) {
        console.error('Gemini サービスのポジティブ要素抽出エラー:', error);
        throw error;
    }
};