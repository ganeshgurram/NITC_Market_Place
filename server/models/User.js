import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["Student", "Admin"], default: "Student" },
    avatarUrl: { type: String },
    department: { type: String, required: true },
    year: { type: String, required: true },
    rollNumber: { type: String, required: true },
    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true } // auto adds createdAt and updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;
