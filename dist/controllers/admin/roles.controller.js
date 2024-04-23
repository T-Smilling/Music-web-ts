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
exports.deleteRole = exports.editPatch = exports.edit = exports.permissionsPatch = exports.permissions = exports.detail = exports.createPost = exports.create = exports.index = void 0;
const role_model_1 = __importDefault(require("../../models/role.model"));
const system_1 = require("../../config/system");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const records = yield role_model_1.default.find(find);
        res.render("admin/pages/roles/index", {
            pageTitle: "Nhóm quyền",
            records: records
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
        res.render("admin/pages/roles/create", {
            pageTitle: "Thêm mới",
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
        const records = new role_model_1.default(req.body);
        yield records.save();
        res.redirect(`/${system_1.systemConfig.prefixAdmin}/roles/permissions`);
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
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id
        };
        const record = yield role_model_1.default.findOne(find);
        res.render("admin/pages/roles/detail", {
            pageTitle: "Chi tiết quyền",
            record: record
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.detail = detail;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false
        };
        const records = yield role_model_1.default.find(find);
        res.render("admin/pages/roles/permissions", {
            pageTitle: "Phân quyền",
            records: records
        });
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            yield role_model_1.default.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.permissionsPatch = permissionsPatch;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idRole = req.params.id;
        let find = {
            _id: idRole,
            deleted: false
        };
        const records = yield role_model_1.default.findOne(find);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa phân quyền",
            record: records
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
        const idRole = req.params.id;
        yield role_model_1.default.updateOne({
            _id: idRole
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
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idRole = req.params.id;
        yield role_model_1.default.updateOne({
            _id: idRole
        }, { deleted: true });
        res.redirect("back");
    }
    catch (error) {
        res.render("client/pages/errors/404", {
            pageTitle: "404 Not Fount",
        });
    }
});
exports.deleteRole = deleteRole;
