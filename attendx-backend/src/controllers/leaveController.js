const supabase = require('../supabaseClient');

exports.applyLeave = async (req, res) => {
    const { type, from_date, to_date, reason } = req.body;
    const userId = req.user.id;

    try {
        // Calculate days between dates
        const start = new Date(from_date);
        const end = new Date(to_date);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const { data, error } = await supabase
            .from('leaves')
            .insert({
                user_id: userId,
                type,
                from_date,
                to_date,
                reason,
                days: diffDays,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaves')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
