const updateUserProfile = async (req, res) => {
    try {
      console.log("updateUserProfile called, req.user:", req.user);
      console.log("updateUserProfile body:", req.body);
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the new email already exists for another user
      if (req.body.email && req.body.email !== user.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
  
      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;
  
      const updatedUser = await user.save();
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: 'Failed to update user profile', error: err.message });
    }
  };
  