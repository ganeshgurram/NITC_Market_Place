import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, department, year, rollNumber } = req.body;

    // Validation
    if (!fullName || !email || !password || !department || !year || !rollNumber)
      return res.status(400).json({ message: "All fields are required" });

    if (!email.endsWith("@nitc.ac.in"))
      return res.status(400).json({ message: "Please use your NITC email address" });

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: fullName,
      email,
      passwordHash,
      department,
      year,
      rollNumber,
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Set secure httpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Send success response
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        rollNumber: user.rollNumber,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
