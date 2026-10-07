import { Request, Response } from "express";
import QuoteRequest from "../models/QuoteRequest";

export const createQuoteRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      company,
      phone,
      email,
      message,
      gstNumber,
      city,
      products = [],
      totalUnits = 0,
      estimatedTotal = 0,
      enquiryType = "cart",
    } = req.body;

    if (!String(name || "").trim() || !String(phone || "").trim() || !String(email || "").trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required",
      });
    }

    const allowedTypes = ["cart", "contact", "wholesale"];

    const quote = await QuoteRequest.create({
      name: String(name).trim(),
      company,
      phone: String(phone).trim(),
      email: String(email).trim(),
      message,
      gstNumber,
      city,
      products,
      totalUnits: Number(totalUnits) || 0,
      estimatedTotal: Number(estimatedTotal) || 0,
      enquiryType: allowedTypes.includes(enquiryType) ? enquiryType : "cart",
    });

    return res.status(201).json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: "Failed to create quote request",
    });
  }
};

export const getQuoteRequests = async (
  _req: Request,
  res: Response
) => {
  try {
    const quotes = await QuoteRequest.find().sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch quote requests",
    });
  }
};

export const updateQuoteStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "contacted",
      "quoted",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quote status",
      });
    }

    const quote =
      await QuoteRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote request not found",
      });
    }

    return res.json({
      success: true,
      message: "Quote status updated",
      quote,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update quote status",
    });
  }
};