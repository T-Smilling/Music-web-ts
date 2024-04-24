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
exports.deleteSinger = exports.editPatch = exports.edit = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const singer = yield singer_model_1.default.find({
            deleted: false,
            status: "active"
        });
        res.render("admin/pages/singer/index", {
            pageTitle: "Danh sách ca sĩ",
            singers: singer
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
        yield singer_model_1.default.updateOne({
            _id: idSinger
        }, req.body);
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
        }, { deleted: true });
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.deleteSinger = deleteSinger;
