const supabase = require('../supabaseClient');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('SUPABASE LOGIN ERROR:', error.message, error.status);
      return res.status(401).json({ success: false, message: error.message });
    }

    // Fetch user profile to check if password reset is needed
    const { data: profile } = await supabase
      .from('users')
      .select('must_reset_password, role')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      success: true,
      token: data.session.access_token,
      user: data.user,
      forceReset: profile?.must_reset_password || false,
      role: profile?.role
    });
  } catch (err) {
    console.error('CATCH ERROR DURING LOGIN:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  // req.user is already attached by authenticate middleware
  res.status(200).json({
    success: true,
    user: req.user
  });
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ success: false, message: 'New password is required' });
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    // Mark password as reset in our public.users table
    await supabase
      .from('users')
      .update({ must_reset_password: false })
      .eq('id', req.user.id);

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
