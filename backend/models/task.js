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
exports.updateTaskStatusByName = async (task_title, status) => {
    const query = `
        UPDATE Tasks
        SET status = ?
        WHERE task_title = ?
    `;
    return new Promise((resolve, reject) => {
        db.query(query, [status, task_title], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getTaskNameByTitle = async (task_title) => {
    const query = "SELECT task_name, status FROM Tasks WHERE task_title = ? LIMIT 1";
    return new Promise((resolve, reject) => {
        db.query(query, [task_title], (err, rows) => {
            if (err) return reject(err);
            // task_nameとstatusの両方を返す
            resolve(rows[0] ? { task_name: rows[0].task_name, status: rows[0].status } : { task_name: "", status: "" });
        });
    });
};
