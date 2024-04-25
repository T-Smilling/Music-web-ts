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
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const setting_model_1 = __importDefault(require("../../models/setting.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SongFeatured = yield song_model_1.default.find({
            featured: "1",
            deleted: false,
            status: "active"
        });
        for (const song of SongFeatured) {
            const infoSinger = yield singer_model_1.default.findOne({
                _id: song.singerId,
                status: "active",
                deleted: false
            });
            song["infoSinger"] = infoSinger;
        }
        const settingsGeneral = yield setting_model_1.default.findOne({});
        res.render("client/pages/homes/index", {
            pageTitle: settingsGeneral.websiteName,
            SongFeatured: SongFeatured
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.index = index;
