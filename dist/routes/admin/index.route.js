"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../config/system");
const dashboard_route_1 = require("./dashboard.route");
const topics_route_1 = require("./topics.route");
const songs_route_1 = require("./songs.route");
const upload_route_1 = require("./upload.route");
const accounts_route_1 = require("./accounts.route");
const roles_route_1 = require("./roles.route");
const auth_route_1 = require("./auth.route");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
const singer_route_1 = require("./singer.route");
const setting_route_1 = require("./setting.route");
const my_account_1 = require("./my-account");
const users_route_1 = require("./users.route");
const AdminRoute = (app) => {
    const prefixAdmin = system_1.systemConfig.prefixAdmin;
    app.use(`/${prefixAdmin}/dashboard`, authMiddleware.requireAuth, dashboard_route_1.DashRouter);
    app.use(`/${prefixAdmin}/topics`, authMiddleware.requireAuth, topics_route_1.TopicAdminRouter);
    app.use(`/${prefixAdmin}/songs`, authMiddleware.requireAuth, songs_route_1.SongAdminRouter);
    app.use(`/${prefixAdmin}/upload`, authMiddleware.requireAuth, upload_route_1.uploadRoutes);
    app.use(`/${prefixAdmin}/singers`, authMiddleware.requireAuth, singer_route_1.SingerAdminRouter);
    app.use(`/${prefixAdmin}/accounts`, authMiddleware.requireAuth, accounts_route_1.AccountAdminRouter);
    app.use(`/${prefixAdmin}/roles`, authMiddleware.requireAuth, roles_route_1.RoleAdminRouter);
    app.use(`/${prefixAdmin}/auth`, auth_route_1.AuthAdminRouter);
    app.use(`/${prefixAdmin}/settings`, authMiddleware.requireAuth, setting_route_1.SettingAdminRouter);
    app.use(`/${prefixAdmin}/my-account`, authMiddleware.requireAuth, my_account_1.MyAccountAdminRouter);
    app.use(`/${prefixAdmin}/users`, authMiddleware.requireAuth, users_route_1.UserAdminRouter);
};
exports.default = AdminRoute;
