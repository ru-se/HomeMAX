const db = require('../config/db');

// タスク一覧取得
exports.getTaskList = async (userId) => {
    const query = `
        SELECT *
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

// クリア済みタスク取得
exports.getClearedTasks = async (userId) => {
    const query = `
        SELECT *
        FROM Tasks
        WHERE user_id = ? AND status = 'true'
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [userId], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// タスクのクリア状況（ステータス）を更新
exports.updateTaskStatusByName = async (taskName, status) => {
    const query = `
        UPDATE Tasks
        SET status = ?
        WHERE task_name = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [status, taskName], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
