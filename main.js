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
const assert_1 = __importDefault(require("assert"));
const dotenv_1 = __importDefault(require("dotenv"));
const find_config_1 = __importDefault(require("find-config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const typechat_1 = require("typechat");
const ts_1 = require("typechat/ts");
const interactive_1 = require("typechat/interactive");
const dotEnvPath = (0, find_config_1.default)(".env");
(0, assert_1.default)(dotEnvPath, ".env file not found!");
dotenv_1.default.config({ path: dotEnvPath });
const model = (0, typechat_1.createLanguageModel)(process.env);
const schema = fs_1.default.readFileSync(path_1.default.join(__dirname, "schema.ts"), "utf8");
const validator = (0, ts_1.createTypeScriptJsonValidator)(schema, "Formula");
const translator = (0, typechat_1.createJsonTranslator)(model, validator);
function processOrder(formula) {
    // Process the items in the cart
    void formula;
}
// Process requests interactively or from the input file specified on the command line
(0, interactive_1.processRequests)("☕> ", process.argv[2], (request) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const formula = response.data;
    console.log(JSON.stringify(formula, undefined, 2));
    if (formula.result.some(formula => formula.type === "unknown")) {
        console.log("I didn't understand the following:");
        for (const result of formula.result) {
            if (result.type === "unknown")
                console.log(result.text);
        }
        return;
    }
    processOrder(formula);
    console.log("Success!");
}));
