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
exports.search = void 0;
const convert_to_slug_helper_1 = require("../../helpers/convert-to-slug.helper");
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const keyword = `${req.query.keyword}`;
        let songs = [];
        const newSongs = [];
        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            const slug = (0, convert_to_slug_helper_1.convertToSlug)(keyword);
            const keywordSlugRegex = new RegExp(slug, "i");
            songs = yield song_model_1.default.find({
                $or: [
                    { title: keywordRegex },
                    { slug: keywordSlugRegex },
                ]
            });
            if (songs.length > 0) {
                for (const song of songs) {
                    const infoSinger = yield singer_model_1.default.findOne({
                        _id: song.singerId,
                        deleted: false,
                    });
                    newSongs.push({
                        id: song.id,
                        title: song.title,
                        avatar: song.avatar,
                        like: song.like,
                        slug: song.slug,
                        infoSinger: {
                            fullName: infoSinger.fullName
                        }
                    });
                }
            }
        }
        ;
        switch (type) {
            case "result":
                res.render("client/pages/search/result", {
                    pageTitle: `Kết quả tìm kiếm: ${keyword}`,
                    keyword: keyword,
                    songs: newSongs
                });
                break;
            case "suggest":
                res.json({
                    code: 200,
                    message: "SUCCESS",
                    songs: newSongs
                });
                break;
            default:
                break;
        }
    }
    catch (error) {
        res.redirect("back");
    }
});
exports.search = search;
