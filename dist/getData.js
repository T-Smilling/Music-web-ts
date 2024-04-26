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
Object.defineProperty(exports, "__esModule", { value: true });
function handler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'https://api.example.com/data';
        try {
            const apiResponse = yield fetch(apiUrl);
            if (apiResponse.ok) {
                const data = yield apiResponse.json();
                return response.status(200).json(data);
            }
            else {
                return response.status(apiResponse.status).json({
                    message: `Failed to fetch data. API returned ${apiResponse.status}`,
                });
            }
        }
        catch (error) {
            console.error(`Error fetching data from ${apiUrl}: ${error}`);
        }
    });
}
exports.default = handler;
