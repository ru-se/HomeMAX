const supabase = require('../config/db');
// NOTE: Make sure to run backend/config/update_tasks_schema.sql to match schema

module.exports = {
    createTask: async (userId, title, icon, color, xp, category) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                user_id: userId,
                title: title,
                is_completed: true,
                created_at: new Date().toISOString(),
                icon: icon,
                color: color,
                xp: xp || 10,
                category: category
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getTasksByUserId: async (userId) => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};
