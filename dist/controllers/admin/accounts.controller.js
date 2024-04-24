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
exports.changeMulti = exports.changeStatus = exports.deleteAccount = exports.editPost = exports.edit = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const system_1 = require("../../config/system");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const filterStatus_helper_1 = require("../../helpers/filterStatus.helper");
const pagination_helper_1 = __importDefault(require("../../helpers/pagination.helper"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false
        };
        if (req.query.status) {
            find.status = req.query.status;
        }
        const filterStatus = (0, filterStatus_helper_1.filterStatusHelper)(req.query);
        const objectSearch = {
            keyword: "",
        };
        if (req.query.keyword) {
            objectSearch.keyword = req.query.keyword;
            const regex = new RegExp(objectSearch.keyword, "i");
            find.fullName = regex;
        }
        let initPagination = {
            currentPage: 1,
            limitItems: 3,
        };
        const countTasks = yield accounts_model_1.default.countDocuments(find);
        let objectPagination = (0, pagination_helper_1.default)(initPagination, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toLocaleString();
            sort[sortKey] = req.query.sortValue;
        }
        const records = yield accounts_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip).select("-password -token");
        const newRecord = [];
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
            records: newRecord,
            keyword: objectSearch.keyword,
            filterStatus: filterStatus,
            pagination: objectPagination
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
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idAccount = req.params.idAccount;
        let find = {
            deleted: false,
            _id: idAccount
        };
        const newRecord = [];
        const record = yield accounts_model_1.default.findOne(find).select("-password -token");
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
        res.render("admin/pages/accounts/detail", {
            pageTitle: "Tài khoản Admin",
            record: newRecord[0]
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
        const idAccount = req.params.idAccount;
        let find = {
            deleted: false,
            _id: idAccount
        };
        const newRecord = [];
        const record = yield accounts_model_1.default.findOne(find).select("-password -token");
        const role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false
        });
        const recordRole = yield role_model_1.default.find({
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
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            record: newRecord[0],
            recordRole: recordRole
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
        const idAccount = req.params.idAccount;
        if (req.body.password) {
            req.body.password = (0, md5_1.default)(req.body.password);
        }
        yield accounts_model_1.default.updateOne({
            _id: idAccount
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
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idAccount = req.params.idAccount;
        yield accounts_model_1.default.updateOne({
            _id: idAccount
        }, { deleted: true });
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.deleteAccount = deleteAccount;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield accounts_model_1.default.updateOne({ _id: id }, {
        status: status,
    });
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            yield accounts_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            yield accounts_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            yield accounts_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
            });
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
