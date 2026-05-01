const supabase = require('../supabaseClient');
const imagekit = require('../imagekitClient');

exports.checkIn = async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Photo is required' });
  }

  try {
    // 1. Upload photo to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `checkin_${userId}_${Date.now()}.jpg`,
      folder: '/attendance/checkins'
    });

    // 2. Create record in Supabase
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        user_id: userId,
        check_in_time: new Date().toISOString(),
        check_in_photo_url: uploadResponse.url,
        check_in_lat_lng: `${lat},${lng}`,
        status: 'present'
      })
      .select()
      .single();

    if (error) {
        // If DB fails, we should ideally delete from ImageKit, but for now:
        throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user.id;

  try {
    // 1. Find today's record that hasn't checked out yet
    const { data: record, error: findError } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .is('check_out_time', null)
      .single();

    if (findError || !record) {
      return res.status(404).json({ success: false, message: 'No active check-in found' });
    }

    let photoUrl = null;
    if (req.file) {
        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: `checkout_${userId}_${Date.now()}.jpg`,
            folder: '/attendance/checkouts'
        });
        photoUrl = uploadResponse.url;
    }

    // 2. Update record
    const { data, error } = await supabase
      .from('attendance')
      .update({
        check_out_time: new Date().toISOString(),
        check_out_photo_url: photoUrl,
        check_out_lat_lng: `${lat},${lng}`,
        status: 'present'
      })
      .eq('id', record.id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTodayStatus = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('date', new Date().toISOString().split('T')[0])
            .maybeSingle();

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getSummary = async (req, res) => {
    const userId = req.user.id;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const startStr = startOfMonth.toISOString().split('T')[0];

    try {
        const { data, error } = await supabase
            .from('attendance')
            .select('normal_hours, overtime_hours')
            .eq('user_id', userId)
            .gte('date', startStr);

        if (error) throw error;

        const summary = data.reduce((acc, curr) => ({
            total_normal_hours: acc.total_normal_hours + (Number(curr.normal_hours) || 0),
            total_overtime_hours: acc.total_overtime_hours + (Number(curr.overtime_hours) || 0)
        }), { total_normal_hours: 0, total_overtime_hours: 0 });

        res.status(200).json({ success: true, data: summary });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
