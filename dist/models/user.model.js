"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const generate_helper_1 = require("../helpers/generate.helper");
const userSchema = new mongoose_1.default.Schema({
    fullName: String,
    password: String,
    email: String,
    token: {
        type: String,
        default: (0, generate_helper_1.generateRandomString)(30)
    },
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});
const User = mongoose_1.default.model("User", userSchema, "User");
exports.default = User;
