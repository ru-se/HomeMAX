const supabase = require('../config/db');

// タスク一覧取得
exports.getTaskList = async (userId) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

// クリア済みタスク取得
exports.getClearedTasks = async (userId) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'true'); // statusは文字列 'true' で格納されている前提

    if (error) throw error;
    return data;
};

// タスクのステータスを更新（task_nameで指定）
exports.updateTaskStatusByName = async (task_name, status) => {
    const { data, error } = await supabase
        .from('tasks')
        .update({ status: status })
        .eq('task_name', task_name); // task_title → task_name に変更

    if (error) throw error;
    return data;
};

// タスク名とステータスを取得（task_nameで検索）
exports.getTaskNameByTitle = async (task_name) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('task_name, status')
        .eq('task_name', task_name)
        .limit(1)
        .single(); // 1件だけ取得

    if (error && error.code !== 'PGRST116') throw error; // not found 以外はエラー
    return data || { task_name: "", status: "" };
};
