"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        ;
        const statistic = {
            Topics: {
                total: 0,
                active: 0,
                inactive: 0
            },
            Songs: {
                total: 0,
                active: 0,
                inactive: 0
            },
            Singers: {
                total: 0,
                active: 0,
                inactive: 0
            },
            Accounts: {
                total: 0,
                active: 0,
                inactive: 0
            },
            Users: {
                total: 0,
                active: 0,
                inactive: 0
            },
        };
        statistic.Topics.total = yield topic_model_1.default.countDocuments({
            deleted: false
        });
        statistic.Topics.active = yield topic_model_1.default.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.Topics.inactive = yield topic_model_1.default.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.Songs.total = yield song_model_1.default.countDocuments({
            deleted: false
        });
        statistic.Songs.active = yield song_model_1.default.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.Songs.inactive = yield song_model_1.default.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.Singers.total = yield singer_model_1.default.countDocuments({
            deleted: false
        });
        statistic.Singers.active = yield singer_model_1.default.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.Singers.inactive = yield singer_model_1.default.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.Accounts.total = yield accounts_model_1.default.countDocuments({
            deleted: false
        });
        statistic.Accounts.active = yield accounts_model_1.default.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.Accounts.inactive = yield accounts_model_1.default.countDocuments({
            deleted: false,
            status: "inactive"
        });
        statistic.Users.total = yield user_model_1.default.countDocuments({
            deleted: false
        });
        statistic.Users.active = yield user_model_1.default.countDocuments({
            deleted: false,
            status: "active"
        });
        statistic.Users.inactive = yield user_model_1.default.countDocuments({
            deleted: false,
            status: "inactive"
        });
        res.render("admin/pages/dashboard/index", {
            pageTitle: "Tổng quan",
            statistic: statistic
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.index = index;
