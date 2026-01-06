const supabase = require('../config/db');

module.exports = {
  createLetter: async (userId, message, mood) => {
    const { data, error } = await supabase
      .from('letters')
      .insert([{
        user_id: userId,
        message: message,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getLettersByUserId: async (userId) => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getLetterById: async (letterId) => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('letter_id', letterId)
      .single();

    if (error) throw error;
    return data;
  }
};
