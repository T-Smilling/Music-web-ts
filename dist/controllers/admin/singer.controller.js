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
exports.changeMulti = exports.changeStatus = exports.deleteSinger = exports.editPatch = exports.edit = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const pagination_helper_1 = __importDefault(require("../../helpers/pagination.helper"));
const filterStatus_helper_1 = require("../../helpers/filterStatus.helper");
const accounts_model_1 = __importDefault(require("../../models/accounts.model"));
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
        const countTasks = yield singer_model_1.default.countDocuments(find);
        let objectPagination = (0, pagination_helper_1.default)(initPagination, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toLocaleString();
            sort[sortKey] = req.query.sortValue;
        }
        const singer = yield singer_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
        for (const item of singer) {
            const user = yield accounts_model_1.default.findOne({
                _id: item.createdBy.account_id
            });
            if (user) {
                item["accountFullName"] = user.fullName;
            }
            const updatedBy = item.updatedBy.slice(-1)[0];
            if (updatedBy) {
                const userUpdated = yield accounts_model_1.default.findOne({
                    _id: updatedBy.account_id
                });
                updatedBy["accountFullName"] = userUpdated.fullName;
            }
        }
        res.render("admin/pages/singer/index", {
            pageTitle: "Danh sách ca sĩ",
            singers: singer,
            keyword: objectSearch.keyword,
            filterStatus: filterStatus,
            pagination: objectPagination,
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
        res.render("admin/pages/singer/create", {
            pageTitle: "Thêm mới ca sĩ",
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
        req.body.createdBy = {
            account_id: res.locals.user.id,
            createAt: new Date()
        };
        const singer = new singer_model_1.default(req.body);
        yield singer.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/singers`);
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
        const idSinger = req.params.idSinger;
        const singer = yield singer_model_1.default.findOne({
            _id: idSinger,
            deleted: false,
            status: "active"
        });
        res.render("admin/pages/singer/detail", {
            pageTitle: "Thông tin ca sĩ",
            singer: singer
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
        const idSinger = req.params.idSinger;
        const singer = yield singer_model_1.default.findOne({
            _id: idSinger,
            deleted: false,
            status: "active"
        });
        res.render("admin/pages/singer/edit", {
            pageTitle: "Chỉnh sửa thông tin ca sĩ",
            singer: singer
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSinger = req.params.idSinger;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield singer_model_1.default.updateOne({
            _id: idSinger
        }, Object.assign(Object.assign({}, req.body), { $push: { updatedBy: updatedBy } }));
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.editPatch = editPatch;
const deleteSinger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSinger = req.params.idSinger;
        yield singer_model_1.default.updateOne({
            _id: idSinger
        }, { deleted: true, deletedBy: {
                account_id: res.locals.user.id,
                deleteAt: new Date(),
            } });
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.deleteSinger = deleteSinger;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    yield singer_model_1.default.updateOne({ _id: id }, {
        status: status,
        $push: { updatedBy: updatedBy }
    });
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    switch (type) {
        case "active":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            break;
        case "inactive":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            break;
        case "delete-all":
            yield singer_model_1.default.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                }
            });
            break;
        default:
            break;
    }
    res.redirect("back");
});
exports.changeMulti = changeMulti;
