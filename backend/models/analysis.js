const supabase = require("../config/db");

module.exports = {
    // ✅ 1日に送信された全お手紙の総数（今日）
    dailyLetterCount: async function () {
    // ローカルの今日の0時0分0秒と翌日の0時0分0秒を取得
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    // ISO文字列に変換（SupabaseのtimestampはUTC基準）
    const startISO = start.toISOString();
    const endISO = end.toISOString();

    const { data, error } = await supabase
        .from("letters")
        .select("created_at", { count: "exact" })
        .gte("created_at", startISO)
        .lt("created_at", endISO);

    if (error) {
        console.log(error);
        throw { err: "検索できませんでした" };
    }

    return {
        date: startISO.split("T")[0], // ローカル日付のYYYY-MM-DD（少しズレる可能性あり）
        count: data.length || 0,
    };
}
,

    // ✅ ポジティブ要素ごとの出現数を集計
    positiveAspectCounts: async function () {
        // SupabaseにはMySQLのような「GROUP BY」 + 集計を直接行う仕組みはないため、
        // フロントもしくはバックエンドで手動集計する
        const { data, error } = await supabase
            .from("homemax")
            .select("positive_aspects");

        if (error) {
            console.log(error);
            throw { err: "検索できませんでした" };
        }

        // 手動で group by
        const countMap = {};
        for (const row of data) {
            const aspect = row.positive_aspects;
            countMap[aspect] = (countMap[aspect] || 0) + 1;
        }

        // 出現回数順に並び替えて返す
        const sorted = Object.entries(countMap)
            .map(([positive_aspects, count]) => ({ positive_aspects, count }))
            .sort((a, b) => b.count - a.count);

        return sorted;
    }
};
