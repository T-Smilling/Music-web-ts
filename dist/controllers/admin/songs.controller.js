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
exports.changeMulti = exports.changeStatus = exports.deleteSong = exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const filterStatus_helper_1 = require("../../helpers/filterStatus.helper");
const pagination_helper_1 = __importDefault(require("../../helpers/pagination.helper"));
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
        else {
            let position;
            sort[position] = "desc";
        }
        const songs = yield song_model_1.default.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
        const newSongs = [];
        for (const song of songs) {
            const topic = yield topic_model_1.default.findOne({
                _id: song.topicId,
            }).select("title");
            const sing = yield singer_model_1.default.findOne({
                _id: song.singerId
            }).select("fullName");
            const user = yield accounts_model_1.default.findOne({
                _id: song.createdBy.account_id
            });
            let accountFullName;
            if (user) {
                accountFullName = user.fullName;
            }
            var updatedBy = song.updatedBy.slice(-1)[0];
            if (updatedBy) {
                const userUpdated = yield accounts_model_1.default.findOne({
                    _id: updatedBy.account_id
                });
                updatedBy.accountFullName = userUpdated.fullName;
            }
            newSongs.push({
                id: song.id,
                title: song.title,
                avatar: song.avatar,
                like: song.like,
                status: song.status,
                slug: song.slug,
                topic: topic.title,
                singer: sing.fullName,
                accountFullName: accountFullName,
                updatedBy: (updatedBy ? updatedBy : [])
            });
        }
        res.render("admin/pages/songs/index", {
            pageTitle: "Danh sách bài hát",
            songs: newSongs,
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
        const topics = yield topic_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("title");
        const singers = yield singer_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("fullName");
        res.render("admin/pages/songs/create", {
            pageTitle: "Thêm mới bài hát",
            topics: topics,
            singers: singers
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
        if (req.body.avatar) {
            req.body.avatar = req.body.avatar[0];
        }
        if (req.body.audio) {
            req.body.audio = req.body.audio[0];
        }
        req.body.createdBy = {
            account_id: res.locals.user.id,
            createAt: new Date()
        };
        ;
        const data = {
            title: req.body.title,
            avatar: req.body.avatar,
            description: req.body.description,
            singerId: req.body.singerId,
            topicId: req.body.topicId,
            lyrics: req.body.lyrics,
            audio: req.body.audio,
            status: req.body.status,
            createdBy: req.body.createdBy
        };
        const song = new song_model_1.default(data);
        yield song.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const songs = yield song_model_1.default.findOne({
            _id: idSong,
            deleted: false
        });
        const topics = yield topic_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("title");
        const singers = yield singer_model_1.default.find({
            deleted: false,
            status: "active"
        }).select("fullName");
        res.render("admin/pages/songs/edit", {
            pageTitle: "Thêm mới bài hát",
            song: songs,
            topics: topics,
            singers: singers
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
        const idSong = req.params.idSong;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        };
        ;
        const data = {
            title: req.body.title,
            description: req.body.description,
            singerId: req.body.singerId,
            topicId: req.body.topicId,
            lyrics: req.body.lyrics,
            status: req.body.status,
        };
        if (req.body.avatar) {
            data["avatar"] = req.body.avatar[0];
        }
        if (req.body.audio) {
            data["audio"] = req.body.audio[0];
        }
        yield song_model_1.default.updateOne({
            _id: idSong
        }, Object.assign(Object.assign({}, data), { $push: { updatedBy: updatedBy } }));
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const song = yield song_model_1.default.findOne({
            _id: idSong,
            deleted: false
        });
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
            deleted: false,
            status: "active"
        }).select("title");
        const singers = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false,
            status: "active"
        }).select("fullName");
        ;
        const data = {
            title: song.title,
            avatar: song.avatar,
            description: song.description,
            singerId: singers.fullName,
            topicId: topic.title,
            lyrics: song.lyrics,
            audio: song.audio,
            status: song.status,
            like: song.like.length,
            listen: song.listen
        };
        res.render("admin/pages/songs/detail", {
            pageTitle: "Chi tiết bài hát",
            data: data
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.detail = detail;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        yield song_model_1.default.updateOne({
            _id: idSong
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
exports.deleteSong = deleteSong;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    yield song_model_1.default.updateOne({ _id: id }, {
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
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            break;
        case "inactive":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            break;
        case "delete-all":
            yield song_model_1.default.updateMany({ _id: { $in: ids } }, {
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
