// The following is a schema definition for ordering lattes.

export interface Formula {
    type: "formula";
    result: MathFunction | CellAddress | CellArea | NumberValue | StringValue;
}

// Use this type for order items that match nothing else

/*export interface UnknownText {
    type: "unknown",
    text: string; // The text that wasn't understood
}
*/

export type validFormula = MathFunction | CellAddress | CellArea | NumberValue | StringValue;

export interface MathFunction {//In my understanding, the naming is relevant to the result. if you simply name this "Function", gpt might thought cell address as function, so I named it MathFunction, we may try other names later
    type: "MathFunction";
    functionName: "ADD" | "MUL" | "SUB" | "DIV" | "MOD" | "POW" | "SQRT" | "ABS" | "EXP" | "LOG" | "LOG10" | "LOG2" | "SUM" | "AVG";
    //argsNumber: number;
    functionArgs: validFormula[];
}

export interface CellAddress {
    type: "CellAddress";
    column: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
    row: number;

}

export interface CellArea {
    type: "CellArea";
    startCellAddress: CellAddress;
    endCellAddress: CellAddress;

}

export interface NumberValue {
    type: "NumberValue";
    value: number;
}

export interface StringValue {
    type: "StringValue";
    value: string;
}
