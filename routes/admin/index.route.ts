import { Express } from "express";
import { systemConfig } from "../../config/system";
import * as userMiddleware from "../../middlewares/user.middleware";
import { DashRouter } from "./dashboard.route";
import { TopicAdminRouter } from "./topics.route";
import { SongAdminRouter } from "./songs.route";
import { uploadRoutes } from "./upload.route";
import { AccountAdminRouter } from "./accounts.route";
import { RoleAdminRouter } from "./roles.route";
import { AuthAdminRouter } from "./auth.route";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";
import { SingerAdminRouter } from "./singer.route";
import { SettingAdminRouter } from "./setting.route";
import { MyAccountAdminRouter } from "./my-account";
import { UserAdminRouter } from "./users.route";

const AdminRoute = (app:Express) :void => {
  const prefixAdmin=systemConfig.prefixAdmin;
  app.use(`/${prefixAdmin}/dashboard`,authMiddleware.requireAuth,DashRouter);
  app.use(`/${prefixAdmin}/topics`,authMiddleware.requireAuth,TopicAdminRouter);
  app.use(`/${prefixAdmin}/songs`,authMiddleware.requireAuth,SongAdminRouter);
  app.use(`/${prefixAdmin}/upload`,authMiddleware.requireAuth,uploadRoutes);
  app.use(`/${prefixAdmin}/singers`,authMiddleware.requireAuth,SingerAdminRouter);
  app.use(`/${prefixAdmin}/accounts`,authMiddleware.requireAuth,AccountAdminRouter);
  app.use(`/${prefixAdmin}/roles`,authMiddleware.requireAuth,RoleAdminRouter);
  app.use(`/${prefixAdmin}/auth`,AuthAdminRouter);
  app.use(`/${prefixAdmin}/settings`,authMiddleware.requireAuth,SettingAdminRouter);
  app.use(`/${prefixAdmin}/my-account`,authMiddleware.requireAuth,MyAccountAdminRouter);
  app.use(`/${prefixAdmin}/users`,authMiddleware.requireAuth,UserAdminRouter);
};

export default AdminRoute;
