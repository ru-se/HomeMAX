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
            const { task_title } = req.body;
            if (!task_title) return res.status(400).json({ error: "task_titleが必要です" });

            // statusをtrueに更新
            await Task.updateTaskStatusByName(task_title, "true");

            // model経由でtask_nameとstatusを取得
            const { task_name, status } = await Task.getTaskNameByTitle(task_title);

            res.json({ message: "タスクのステータスを更新しました", task_name, status });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "タスクステータス更新エラー" });
        }
    }
};