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
exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield song_model_1.default.find({
        deleted: false
    });
    const newSongs = [];
    for (const song of songs) {
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
        }).select("title");
        const sing = yield singer_model_1.default.findOne({
            _id: song.singerId
        }).select("fullName");
        newSongs.push({
            id: song.id,
            title: song.title,
            avatar: song.avatar,
            like: song.like,
            status: song.status,
            slug: song.slug,
            topic: topic.title,
            singer: sing.fullName
        });
    }
    res.render("admin/pages/songs/index", {
        pageTitle: "Danh sách bài hát",
        songs: newSongs
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        req.body.audio = req.body.audio[0];
    }
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
    };
    const song = new song_model_1.default(data);
    yield song.save();
    res.redirect(`/${system_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
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
    }, data);
    res.redirect("back");
});
exports.editPatch = editPatch;