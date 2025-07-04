import createResponse from "../lib/Response.js";
import HTTP from "../lib/HTTP.js";
import { registerUserSchema } from "../schemas/userSchema.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../errors/AppError.js";

export const registerUser = async (req, res, next) => {
  const result = registerUserSchema.safeParse(req.body);

  try {
    if (!result.success) throw result.error;

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

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("_Secure-Token");
    return res.json(createResponse(true, "Logout successful"));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "Invalid credentials")
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "Invalid credentials")
      );
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const cookieName =
      process.env.NODE_ENV == "production" ? "__Secure-Token" : "_Secure-Token";

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.json(createResponse(true, "Login successful", { token }));
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const decoded = req.user;
    const user = await User.findById(decoded.userId);
    const userObject = user.toObject();
    delete userObject.password;

    return res.json(
      createResponse(true, "User details fetched successfully", userObject)
    );
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const decoded = req.user;
    const updates = {};

    if (req.body?.username) updates.username = req.body.username;
    if (req.body?.email) updates.email = req.body.email;

    if (Object.keys(updates).length === 0) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(
          false,
          "No fields to update. Allowed fields: username, email"
        )
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json(
      createResponse(true, "User updated successfully", {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      })
    );
  } catch (e) {
    next(e);
  }
};
