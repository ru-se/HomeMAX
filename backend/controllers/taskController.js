const Task = require("../models/task");
const geminiService = require("../services/geminiService");

module.exports = {
    // タスク一覧取得
    getTaskList: async function (req, res) {
        try {
            const userId = req.user ? req.user.user_id : null;
            if (!userId) return res.status(401).json({ error: "認証が必要です" });

            const tasks = await Task.getTasksByUserId(userId);
            res.json(tasks);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "タスク一覧取得エラー" });
        }
    },

    // クリア済みタスク取得 (今回は使用しない可能性が高いが念のため更新)
    getClearedTasks: async function (req, res) {
        try {
            const userId = req.user ? req.user.user_id : null;
            if (!userId) return res.status(401).json({ error: "認証が必要です" });

            // modelにgetClearedTasksがあれば使うが、なければgetTasksByUserIdでフィルタリング
            const tasks = await Task.getTasksByUserId(userId);
            const cleared = tasks.filter(t => t.status === 'completed' || t.is_completed === true);
            res.json(cleared);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "クリア状況取得エラー" });
        }
    },

    // タスクのクリア状況を更新 (新規作成または既存更新)
    updateTaskStatus: async function (req, res) {
        try {
            const userId = req.user ? req.user.user_id : null;
            if (!userId) return res.status(401).json({ error: "認証が必要です" });

            const { task_title, icon, color, xp, category } = req.body;
            if (!task_title) return res.status(400).json({ error: "task_titleが必要です" });

            // AIで褒め言葉を生成
            const praisePrompt = `ユーザーが「${task_title}」というタスクを達成しました。モチベーションが上がるような、温かい褒め言葉を40文字以内で短く一言で生成してください。`;
            let praiseMessage = "えらい！";
            try {
                praiseMessage = await geminiService.generateCompliment(praisePrompt);
            } catch (e) {
                console.error("Gemini Error:", e);
                const praiseMessages = ["えらい！", "すごいね！", "さすが！", "その調子！"];
                praiseMessage = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
            }

            // DBに保存
            const newTask = await Task.createTask(userId, task_title, icon, color, xp, category);

            // 経験値を加算
            const User = require("../models/user");
            const xpResult = await User.addXp(userId, xp || 10);

            res.json({
                message: "タスクを記録しました",
                task_name: task_title,
                praise: praiseMessage,
                task: newTask,
                xpResult: xpResult // レベルアップ情報を含める
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "タスクステータス更新エラー" });
        }
    }
};