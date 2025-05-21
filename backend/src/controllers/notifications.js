import mongoose from "mongoose";
import Notification from "../models/Notification.js";
import createResponse from "../lib/Response.js";
import HTTP from "../lib/HTTP.js";
import AppError from "../errors/AppError.js";
import { pushNotificationSchema } from "../schemas/notificationSchema.js";

export async function getNotifications(req, res, next) {
  try {
    const { eventId } = req.params;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    const notifications = await Notification.find({ event: eventId });

    return res.json(
      createResponse(true, "Notification fetched successfully", notifications)
    );
  } catch (e) {
    next(e);
  }
}

export async function pushNotification(req, res, next) {
  try {
    const { eventId } = req.params;
    const { userId } = req.user;

    const result = pushNotificationSchema.safeParse(req.body);
    if (!result.success) throw result.error;

    const { message } = result.data;

    if (!mongoose.isValidObjectId(eventId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid event ID")
      );
    }

    if (!mongoose.isValidObjectId(userId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid user ID")
      );
    }

    const notification = await Notification.create({
      message,
      event: eventId,
      createdBy: userId,
    });

    return res.json(
      createResponse(true, "Notification sent to attendees", notification)
    );
  } catch (e) {
    next(e);
  }
}

export async function updateNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    const { userId } = req.user;

    if (!mongoose.isValidObjectId(notificationId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid notification ID")
      );
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Notification not found")
      );
    }

    if (notification.createdBy?.toString() !== userId) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "You are not allowed to update this notification")
      );
    }

    const result = pushNotificationSchema.safeParse(req.body);
    if (!result.success) throw result.error;

    const { message } = result.data;

    notification.message = message;
    await notification.save();

    return res.json(
      createResponse(true, "Notification updated successfully", notification)
    );
  } catch (e) {
    next(e);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    const { userId } = req.user;

    if (!mongoose.isValidObjectId(notificationId)) {
      throw new AppError(
        HTTP.BAD_REQUEST,
        createResponse(false, "Invalid notification ID")
      );
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      throw new AppError(
        HTTP.NOT_FOUND,
        createResponse(false, "Notification not found")
      );
    }

    if (notification.createdBy?.toString() !== userId) {
      throw new AppError(
        HTTP.UNAUTHORIZED,
        createResponse(false, "You are not allowed to delete this notification")
      );
    }

    await notification.deleteOne();

    return res.json(
      createResponse(true, "Notification deleted successfully", notification)
    );
  } catch (e) {
    console.log(e);
    next(e);
  }
}
