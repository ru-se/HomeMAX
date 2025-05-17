const db = require('../config/db');

// タスク一覧取得
exports.getTaskList = async (userId) => {
    const query = `
        SELECT task_id, task_name, task_type, status, created_at
        FROM Tasks
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// タスク進捗状況取得（ステータスごとに集計）
exports.getTaskProgress = async (userId) => {
    const query = `
        SELECT status, COUNT(*) as count
        FROM Tasks
        WHERE user_id = ?
        GROUP BY status
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// クリア済みタスク取得
exports.getClearedTasks = async (userId) => {
    const query = `
        SELECT *
        FROM Tasks
        WHERE user_id = ? AND status = 'cleared'
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// タスクのクリア状況（ステータス）を更新
exports.updateTaskStatus = async (taskId, status) => {
    const query = `
        UPDATE Tasks
        SET status = ?
        WHERE task_id = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [status, taskId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};