import assert from "assert";
import dotenv from "dotenv";
import findConfig from "find-config";
import fs from "fs";
import path from "path";
import { createJsonTranslator, createLanguageModel } from "typechat";
import { createTypeScriptJsonValidator } from "typechat/ts";
import { processRequests } from "typechat/interactive";
import { Formula, validFormula } from "./schema";
import { myProcessRequests } from "./myProcessRequests";
import { json } from "stream/consumers";

const dotEnvPath = findConfig(".env");
assert(dotEnvPath, ".env file not found!");
dotenv.config({ path: dotEnvPath });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "schema.ts"), "utf8");
const validator = createTypeScriptJsonValidator<Formula>(schema, "Formula");
const translator = createJsonTranslator(model, validator);

function processFormula(formula: validFormula):string {
    // Process the items in the cart
    let result:string = "";
    if(formula.type === "MathFunction") {
        result = (formula.functionName + "(");
        for(let i = 0; i < formula.functionArgs.length; i++) {
            result += processFormula(formula.functionArgs[i]);
            if(i < formula.functionArgs.length - 1) {
                result += ",";  
            }
        }
        result += ")";
    }
    else if(formula.type === "CellAddress") {
        result = (formula.column + formula.row.toString());
    }
    else if(formula.type === "CellArea") {
        result = processFormula(formula.startCellAddress) + ":" + processFormula(formula.endCellAddress);
    }
    else if(formula.type === "NumberValue") {
        result = formula.value.toString();
    }
    else if(formula.type === "StringValue") {
        result = formula.value;
    }
    return result;
}

// Process requests interactively or from the input file specified on the command line
myProcessRequests("Discribe the formula: ", process.argv[2], async (request) => {
    const response = await translator.translate(request);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const formula = response.data;
    console.log(JSON.stringify(formula, undefined, 2));
    let result = formula.result;
    /*
    if (formula.result.type !== "validFormula") {
        console.log("I didn't understand the following:");
        if (result.type === "unknown") console.log(result.text);
        return;
    }
    */
    console.log("=" + processFormula(result));
    console.log("Success!");
});
