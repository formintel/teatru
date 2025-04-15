import express from "express";
import {
  addAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
  getAdminBookings,
  getAdminStatistics,
} from "../controllers/admin-controller.js";

const adminRouter = express.Router();

adminRouter.post("/signup", addAdmin);
adminRouter.post("/login", adminLogin);
adminRouter.get("/", getAdmins);
adminRouter.get("/:id", getAdminById);
adminRouter.get("/:id/bookings", getAdminBookings);
adminRouter.get("/:id/statistics", getAdminStatistics);

export default adminRouter;
