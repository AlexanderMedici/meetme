import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

//@desc Auth User get token
//@route Post /api/users/login
//@ access public not portected
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // set jwt as cookie http
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
//@desc Register
//@route post /api/users
//@ access public not portected
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
});

//@desc Logout clear cookies
//@route post /api/users/logout
//@ access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User is Loggeout" });
});

//@desc User Profile
//@route get /api/users/profile
//@ access private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send("user profile ");
});

//@desc update Profile
//@route put /api/users/profile
//@ access private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("user profile update");
});

//@desc get all users
//@route GET /api/users
//@ access private/admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get users");
});
//@desc get user by id
//@route GET /api/users/:Id
//@ access private/admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("get user by id");
});

//@desc delete  users
//@route DELETE /api/users/:id
//@ access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete users");
});

//@desc update  user
//@route PUT /api/users/:id
//@ access private/admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
