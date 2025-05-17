const pool = require('../config/db');

// タスク一覧取得
exports.getTaskList = async (userId) => {
    const query = `
        SELECT task_id, task_name, task_type, status, created_at
        FROM "Tasks"
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// タスク進捗状況取得（ステータスごとに集計）
exports.getTaskProgress = async (userId) => {
    const query = `
        SELECT status, COUNT(*) as count
        FROM "Tasks"
        WHERE user_id = $1
        GROUP BY status
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// クリア済みタスク取得
exports.getClearedTasks = async (userId) => {
    const query = `
        SELECT *
        FROM "Tasks"
        WHERE user_id = $1 AND status = 'cleared'
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

// タスクのクリア状況（ステータス）を更新
exports.updateTaskStatus = async (taskId, status) => {
    const query = `
        UPDATE "Tasks"
        SET status = $1
        WHERE task_id = $2
    `;
    const result = await pool.query(query, [status, taskId]);
    return result;
};