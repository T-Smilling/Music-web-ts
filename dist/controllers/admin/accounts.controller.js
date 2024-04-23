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
exports.createPost = exports.create = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const system_1 = require("../../config/system");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const newRecord = [];
        const records = yield accounts_model_1.default.find(find).select("-password -token");
        for (const record of records) {
            const role = yield role_model_1.default.findOne({
                _id: record.role_id,
                deleted: false
            });
            newRecord.push({
                id: record.id,
                fullName: record.fullName,
                email: record.email,
                phone: record.phone,
                role: role.title,
                status: record.status,
            });
        }
        res.render("admin/pages/accounts/index", {
            pageTitle: "Tài khoản Admin",
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
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const records = yield role_model_1.default.find(find);
        res.render("admin/pages/accounts/create", {
            pageTitle: "Tạo mới tài khoản",
            records: records
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield accounts_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (emailExist) {
            res.redirect("back");
        }
        else {
            req.body.password = (0, md5_1.default)(req.body.password);
            const records = new accounts_model_1.default(req.body);
            yield records.save();
            res.redirect(`/${system_1.systemConfig.prefixAdmin}/accounts`);
        }
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.createPost = createPost;
