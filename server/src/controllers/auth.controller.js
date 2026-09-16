const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

const SALT_ROUNDS = 10;

/**
 * @name registerUserController
 * @desc register a new user, expects username, email, and password in the request body.
 * @access Public
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // .create() will automatically save the user to the database and return the created user document
    const user = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // generate a JWT token for the user
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // set token in cookie
    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @name loginUserController
 * @desc login a user, expects email and password in the request body.
 * @access Public
 */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate a JWT token for the user
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // set token in cookie
    res.cookie("token", token);

    return res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


/**
 * @name logoutUserController
 * @desc logout a user, expects no parameters in the request body. It will clear the token from the cookie and add it to the blacklist.
 * @access Public
 */
async function logoutUserController(req, res) {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;

    // Add the token to the blacklist
    if (token) await tokenBlacklistModel.create({ token });

    // Clear the token from the cookie
    res.clearCookie("token");

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @name getMeController
 * @desc get the current user information, expects no parameters in the request body. It will return the user information based on the token in the cookie.
 * @access Private
 */
async function getMeController(req, res) {
  try {
    // Get the user information from the request object (set by authUser middleware)
    const user = await userModel.findById(req.user.id).select("-password"); // Exclude password from the response

    return res.status(200).json({ user, message: "User information retrieved successfully" });
  } catch (error) {
    console.error("Error getting user information:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController };
