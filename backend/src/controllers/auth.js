import createResponse from "../utils/Response.js";
import HTTP from "../utils/HTTP.js";
import { registerUserSchema } from "../schemas/userSchema.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  const result = registerUserSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(HTTP.BAD_REQUEST)
      .json(createResponse(false, "Invalid request", result.error.flatten()));
  }

  try {
    const { username, email, password } = result.data;

    const existing = await User.findOne({ email });

    if (existing) {
      return res
        .status(HTTP.CONFLICT)
        .json(createResponse(false, "Email already registered. Please login"));
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    return res
      .status(HTTP.CREATED)
      .json(createResponse(true, "Registeration successful"));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json(createResponse(false, "Invalid credentials"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json(createResponse(false, "Invalid credentials"));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.json(createResponse(true, "Login successful", { token }));
  } catch (error) {
    next(error);
  }
};
