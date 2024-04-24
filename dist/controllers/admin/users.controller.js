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
exports.changeMulti = exports.changeStatus = exports.deleteUser = exports.editPost = exports.edit = exports.detail = exports.index = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const pagination_helper_1 = __importDefault(require("../../helpers/pagination.helper"));
const filterStatus_helper_1 = require("../../helpers/filterStatus.helper");
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
        const countTasks = yield user_model_1.default.countDocuments(find);
        let objectPagination = (0, pagination_helper_1.default)(initPagination, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toLocaleString();
            sort[sortKey] = req.query.sortValue;
        }
        const records = yield user_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip).select("-password -token");
        const newRecord = [];
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
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    yield user_model_1.default.updateOne({ _id: id }, {
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
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active" });
            break;
        case "inactive":
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            break;
        case "delete-all":
            yield user_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
            });
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
