const User = require("../models/user");

// GET user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, usersList: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// GET all non-admin members
const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ isAdmin: false });
    res.status(200).json({ success: true, membersList: members });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ADD user (with photo)
const addUser = async (req, res) => {
  const { name, email, password, dob, phone, isAdmin } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(403)
        .json({ success: false, message: "User already exists" });

    const newUser = new User({
      name,
      email,
      dob,
      phone,
      isAdmin,
    });

    // set password
    newUser.setPassword(password);

    // set photo path if uploaded
    if (req.file) {
      newUser.photoUrl = `/uploads/${req.file.filename}`;
    }

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = { ...req.body };

    // if password update
    if (req.body.password) {
      const tempUser = new User();
      tempUser.setPassword(req.body.password);
      updateData.hash = tempUser.hash;
      updateData.salt = tempUser.salt;
      delete updateData.password; // don't save plain password
    }

    // handle new photo
    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, deletedUser });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
};
