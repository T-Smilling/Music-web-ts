"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const system_1 = require("../../config/system");
const dashboard_route_1 = require("./dashboard.route");
const topics_route_1 = require("./topics.route");
const songs_route_1 = require("./songs.route");
const upload_route_1 = require("./upload.route");
const AdminRoute = (app) => {
    const prefixAdmin = system_1.systemConfig.prefixAdmin;
    app.use(`/${prefixAdmin}/dashboard`, dashboard_route_1.DashRouter);
    app.use(`/${prefixAdmin}/topics`, topics_route_1.TopicAdminRouter);
    app.use(`/${prefixAdmin}/songs`, songs_route_1.SongAdminRouter);
    app.use(`/${prefixAdmin}/upload`, upload_route_1.uploadRoutes);
};
exports.default = AdminRoute;
