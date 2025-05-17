const Task = require("../models/task");

module.exports = {
    // タスク一覧取得
    getTaskList: async function(req, res) {
        try {
            const userId = req.query.user_id || req.body.user_id || (req.session.user && req.session.user.user_id);
            if (!userId) return res.status(400).json({ error: "user_idが必要です" });
            const tasks = await Task.getTaskList(userId);
            res.json(tasks);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "タスク一覧取得エラー" });
        }
    },

    // タスク進捗状況取得
    getTaskProgress: async function(req, res) {
        try {
            const userId = req.query.user_id || req.body.user_id || (req.session.user && req.session.user.user_id);
            if (!userId) return res.status(400).json({ error: "user_idが必要です" });
            const progress = await Task.getTaskProgress(userId);
            res.json(progress);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "進捗状況取得エラー" });
        }
    },

    // クリア済みタスク取得
    getClearedTasks: async function(req, res) {
        try {
            const userId = req.query.user_id || req.body.user_id || (req.session.user && req.session.user.user_id);
            if (!userId) return res.status(400).json({ error: "user_idが必要です" });
            const cleared = await Task.getClearedTasks(userId);
            res.json(cleared);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "クリア状況取得エラー" });
        }
    },

    // タスクのクリア状況を更新
    updateTaskStatus: async function(req, res) {
        try {
            const { task_id, status } = req.body;
            if (!task_id || !status) return res.status(400).json({ error: "task_idとstatusが必要です" });
            await Task.updateTaskStatus(task_id, status);
            res.json({ message: "タスクのステータスを更新しました" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "タスクステータス更新エラー" });
        }
    }
};