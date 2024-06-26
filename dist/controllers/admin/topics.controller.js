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
exports.changeMulti = exports.changeStatus = exports.deleteTopic = exports.editPatch = exports.edit = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const pagination_helper_1 = __importDefault(require("../../helpers/pagination.helper"));
const filterStatus_helper_1 = require("../../helpers/filterStatus.helper");
const system_1 = require("../../config/system");
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
            find.title = regex;
        }
        let initPagination = {
            currentPage: 1,
            limitItems: 3,
        };
        const countTasks = yield topic_model_1.default.countDocuments(find);
        let objectPagination = (0, pagination_helper_1.default)(initPagination, req.query, countTasks);
        const sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const sortKey = req.query.sortKey.toLocaleString();
            sort[sortKey] = req.query.sortValue;
        }
        const topics = yield topic_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
        for (const topic of topics) {
            const user = yield accounts_model_1.default.findOne({
                _id: topic.createdBy.account_id
            });
            if (user) {
                topic["accountFullName"] = user.fullName;
            }
            const updatedBy = topic.updatedBy.slice(-1)[0];
            if (updatedBy) {
                const userUpdated = yield accounts_model_1.default.findOne({
                    _id: updatedBy.account_id
                });
                updatedBy["accountFullName"] = userUpdated.fullName;
            }
        }
        res.render("admin/pages/topics/index", {
            pageTitle: "Quản lý chủ đề",
            topics: topics,
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
        res.render("admin/pages/topics/create", {
            pageTitle: "Thêm mới chủ đề",
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
        req.body.avatar = req.body.avatar[0];
        req.body.createdBy = {
            account_id: res.locals.user.id,
            createAt: new Date()
        };
        const record = new topic_model_1.default(req.body);
        yield record.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/topics`);
    }
    catch (error) {
        console.log(error);
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.createPost = createPost;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idTopic = req.params.idTopic;
        const topic = yield topic_model_1.default.findOne({
            _id: idTopic,
            deleted: false
        });
        res.render("admin/pages/topics/detail", {
            pageTitle: "Chi tiết chủ đề",
            topic: topic
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
        const idTopic = req.params.idTopic;
        const topic = yield topic_model_1.default.findOne({
            _id: idTopic,
            deleted: false
        });
        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic
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
        const idTopic = req.params.idTopic;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        yield topic_model_1.default.updateOne({
            _id: idTopic
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
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idTopic = req.params.idTopic;
        yield topic_model_1.default.updateOne({
            _id: idTopic
        }, { deleted: true,
            deletedBy: {
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
exports.deleteTopic = deleteTopic;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    yield topic_model_1.default.updateOne({ _id: id }, {
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
            yield topic_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            break;
        case "inactive":
            yield topic_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            break;
        case "delete-all":
            yield topic_model_1.default.updateMany({ _id: { $in: ids } }, {
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
