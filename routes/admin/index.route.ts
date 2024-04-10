import { Express } from "express";
import { systemConfig } from "../../config/system";
import * as userMiddleware from "../../middlewares/user.middleware";
import { DashRouter } from "./dashboard.route";
import { TopicAdminRouter } from "./topics.route";
import { SongAdminRouter } from "./songs.route";
import { uploadRoutes } from "./upload.route";

const AdminRoute = (app:Express) :void => {
  const prefixAdmin=systemConfig.prefixAdmin;
  app.use(`/${prefixAdmin}/dashboard`,DashRouter);
  app.use(`/${prefixAdmin}/topics`,TopicAdminRouter);
  app.use(`/${prefixAdmin}/songs`,SongAdminRouter);
  app.use(`/${prefixAdmin}/upload`,uploadRoutes)
};

export default AdminRoute;
