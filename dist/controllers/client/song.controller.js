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
exports.listen = exports.favorite = exports.like = exports.detailSong = exports.list = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugTopic = req.params.slugTopic;
        const topic = yield topic_model_1.default.findOne({
            slug: slugTopic,
            status: "active",
            deleted: false
        });
        const songs = yield song_model_1.default.find({
            topicId: topic.id,
            status: "active",
            deleted: false
        }).select("title avatar singerId like slug");
        for (const song of songs) {
            const infoSinger = yield singer_model_1.default.findOne({
                _id: song.singerId,
                status: "active",
                deleted: false
            });
            song["infoSinger"] = infoSinger;
        }
        res.render("client/pages/songs/list", {
            pageTitle: topic.title,
            songs: songs
        });
    }
    catch (error) {
        console.log(error);
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.list = list;
const detailSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = res.locals.user.id;
        const slugSong = req.params.slugSongs;
        const song = yield song_model_1.default.findOne({
            slug: slugSong,
            status: "active",
            deleted: false
        });
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false
        }).select("fullName");
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
            deleted: false
        }).select("title");
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            userId: id,
            songId: song.id
        });
        song["isFavoriteSong"] = favoriteSong ? true : false;
        res.render("client/pages/songs/detail", {
            pageTitle: song.title,
            song: song,
            singer: singer,
            topic: topic
        });
    }
    catch (error) {
        console.log(error);
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.detailSong = detailSong;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const type = req.params.type;
        const UserId = res.locals.user.id;
        let updateQuery;
        if (type === "yes") {
            updateQuery = { $addToSet: { like: UserId } };
        }
        else {
            updateQuery = { $pull: { like: UserId } };
        }
        const song = yield song_model_1.default.findByIdAndUpdate(idSong, updateQuery, { new: true, runValidators: true });
        let updateLike = song.like.length;
        res.json({
            code: 200,
            message: "Thành công!",
            like: updateLike
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: 404,
            message: "ERROR!",
        });
    }
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const type = req.params.type;
        const UserId = res.locals.user.id;
        if (type == "yes") {
            const existRecord = yield favorite_song_model_1.default.findOne({
                userId: UserId,
                songId: idSong
            });
            if (!existRecord) {
                const record = new favorite_song_model_1.default({
                    userId: UserId,
                    songId: idSong
                });
                yield record.save();
            }
        }
        else {
            yield favorite_song_model_1.default.deleteOne({
                userId: UserId,
                songId: idSong
            });
        }
        res.json({
            code: 200,
            message: "Thành công!",
        });
    }
    catch (error) {
        console.log(error);
        res.json({
            code: 404,
            message: "ERROR!",
        });
    }
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const song = yield song_model_1.default.findOne({
            _id: idSong
        });
        const listen = song.listen + 1;
        yield song_model_1.default.updateOne({
            _id: idSong
        }, {
            listen: listen
        });
        res.json({
            code: 200,
            message: "Thành công!",
            listen: listen
        });
    }
    catch (error) {
        res.json({
            code: 404,
            message: "ERROR!",
        });
    }
});
exports.listen = listen;
