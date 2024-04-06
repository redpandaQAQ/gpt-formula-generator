import assert from "assert";
import dotenv from "dotenv";
import findConfig from "find-config";
import fs from "fs";
import path from "path";
import { createJsonTranslator, createLanguageModel } from "typechat";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { processRequests } from "typechat/interactive";
import { Formula } from "./schema";

const dotEnvPath = findConfig(".env");
assert(dotEnvPath, ".env file not found!");
dotenv.config({ path: dotEnvPath });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "schema.ts"), "utf8");
const validator = createTypeScriptJsonValidator<Formula>(schema, "Formula");
const translator = createJsonTranslator(model, validator);

function processOrder(formula: Formula) {
    // Process the items in the cart
    void formula;
}

// Process requests interactively or from the input file specified on the command line
processRequests("☕> ", process.argv[2], async (request) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const formula = response.data;
    console.log(JSON.stringify(formula, undefined, 2));
    if (formula.result.some(formula => formula.type === "unknown")) {
        console.log("I didn't understand the following:");
        for (const result of formula.result) {
            if (result.type === "unknown") console.log(result.text);
        }
        return;
    }
    processOrder(formula);
    console.log("Success!");
});
