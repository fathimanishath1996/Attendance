const supabase = require('../supabaseClient');

exports.getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllAttendance = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*, users(name, email)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.manageLeave = async (req, res) => {
    const { leaveId, status } = req.body; // status: 'approved' or 'rejected'

    try {
        const { data, error } = await supabase
            .from('leaves')
            .update({ status })
            .eq('id', leaveId)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('leaves')
            .select(`
                *,
                users:user_id (name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
