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
exports.resetPassword = exports.otp = exports.forgotPassword = exports.forgotPass = exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const generate_helper_1 = require("../../helpers/generate.helper");
const sendMail_helper_1 = require("../../helpers/sendMail.helper");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("client/pages/user/register", {
            pageTitle: "Đăng kí tài khoản",
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existEmail = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (existEmail) {
            res.json({
                code: 400,
                message: "Email đã tồn tại!"
            });
        }
        else {
            req.body.password = (0, md5_1.default)(req.body.password);
            req.body.token = (0, generate_helper_1.generateRandomString)(30);
            const user = new user_model_1.default(req.body);
            const data = yield user.save();
            res.json({
                code: 200,
                message: "Tạo tài khoản thành công!",
                token: data.token
            });
        }
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.registerPost = registerPost;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("client/pages/user/login", {
            pageTitle: "Đăng nhập tài khoản",
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
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!user) {
            res.json({
                code: 400,
                message: "Email không tồn tại!"
            });
            return;
        }
        if ((0, md5_1.default)(password) != user.password) {
            res.json({
                code: 401,
                message: "Sai mật khẩu!"
            });
            return;
        }
        const token = user.token;
        res.json({
            code: 200,
            message: "Đăng nhập thành công",
            token: token
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("tokenUser");
    res.redirect("/topics");
});
exports.logout = logout;
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/forgot", {
        pageTitle: "Quên mật khẩu",
    });
});
exports.forgotPass = forgotPass;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const existEmail = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!existEmail) {
            res.json({
                code: 400,
                message: "Email không tồn tại!"
            });
            return;
        }
        const otp = (0, generate_helper_1.generateRandomNumber)(8);
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now() + 5 * 60 * 1000
        };
        const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
        yield forgotPassword.save();
        const subject = `Mã OTP lấy lại mật khẩu`;
        const content = `Mã OTP lấy lại mật khẩu là ${otp}. Vui lòng không chia sẻ cho bất kì ai mã OTP này. Mã có hiệu lực 5 phút.`;
        (0, sendMail_helper_1.sendMail)(email, subject, content);
        res.render("client/pages/user/otp-password", {
            pageTitle: "Nhập OTP",
            email: email
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 NOT FOUND",
        });
    }
});
exports.forgotPassword = forgotPassword;
const otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const result = yield forgot_password_model_1.default.findOne({
            email: email,
            otp: otp
        });
        if (!result) {
            res.json({
                code: 400,
                message: "OTP không tồn tại!"
            });
            return;
        }
        const user = yield user_model_1.default.findOne({
            email: email
        });
        res.cookie("tokenUser", user.token);
        res.render("client/pages/user/reset-password", {
            pageTitle: "Nhập OTP",
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 NOT FOUND",
        });
    }
});
exports.otp = otp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.tokenUser;
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({
            token: token,
            deleted: false
        });
        if (!user) {
            res.json({
                code: 400,
                message: "Tài khoản không tồn tại!"
            });
            return;
        }
        yield user_model_1.default.updateOne({
            token: token
        }, {
            password: (0, md5_1.default)(password)
        });
        res.redirect("/");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 NOT FOUND",
        });
    }
});
exports.resetPassword = resetPassword;
