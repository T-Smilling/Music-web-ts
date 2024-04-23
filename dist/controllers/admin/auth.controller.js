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
exports.logout = exports.loginPost = exports.login = void 0;
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const md5_1 = __importDefault(require("md5"));
const system_1 = require("../../config/system");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập",
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = yield accounts_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!user) {
            res.redirect("back");
            return;
        }
        if ((0, md5_1.default)(password) != user.password) {
            res.redirect("back");
            return;
        }
        if (user.status == "inactive") {
            res.redirect("back");
            return;
        }
        res.cookie("token", user.token);
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/dashboard`);
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/auth/login`);
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.logout = logout;
