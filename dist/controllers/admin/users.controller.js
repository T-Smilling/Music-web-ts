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
exports.deleteUser = exports.editPost = exports.edit = exports.detail = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const newRecord = [];
        const records = yield user_model_1.default.find(find).select("-password -token");
        for (const record of records) {
            newRecord.push({
                id: record.id,
                fullName: record.fullName,
                email: record.email,
                status: record.status,
            });
        }
        res.render("admin/pages/users/index", {
            pageTitle: "Tài khoản User",
            records: newRecord
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.idUser;
        const user = yield user_model_1.default.findOne({
            _id: idUser,
            deleted: false
        }).select("-password -token");
        res.render("admin/pages/users/detail", {
            pageTitle: "Chi tiết tài khoản",
            user: user
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.idUser;
        const user = yield user_model_1.default.findOne({
            _id: idUser,
            deleted: false
        });
        res.render("admin/pages/users/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            user: user
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.edit = edit;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.idUser;
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        ;
        yield user_model_1.default.updateOne({
            _id: idUser
        }, req.body);
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.editPost = editPost;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.idUser;
        yield user_model_1.default.updateOne({
            _id: idUser
        }, { deleted: true });
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.deleteUser = deleteUser;
