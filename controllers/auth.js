const { generateToken } = require("../lib/utils.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const {cloudinary} = require("../lib/cloudinary.js")

const signup = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;

        // Validate input fields
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if the email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "E-mail already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate a token and send response
        generateToken(newUser._id, res);
        res.status(200).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Server error during signup" });
    }
};
  
const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // no user found 
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // checking password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        }

        generateToken(user._id, res);
    
        res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
  
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate( userId, { image: result.secure_url}, { new: true } );
  
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { signup, login, logout, updateProfile, checkAuth};