// The following is a schema definition for ordering lattes.

export interface Formula {
    type: "formula";
    result: (validFormula | UnknownText)[];
}

// Use this type for order items that match nothing else
export interface UnknownText {
    type: "unknown",
    text: string; // The text that wasn't understood
}

export type validFormula = Functions | CellRef | CellAreaRef | SNumber | SString;

export interface Functions {
    type: "funcName";
    name: "ADD " | "MUL" | "SUB" | "DIV" | "MOD" | "POW" | "SQRT" | "ABS" | "EXP" | "LOG" | "LOG10" | "LOG2" | "SUM" | "AVG";
    argsNumber: number;
    args: validFormula[];
}

export interface CellRef {
    type: "cellref";
    column: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";
    row: number;

}

export interface CellAreaRef {
    type: "cellarearef";
    start: CellRef;
    end: CellRef;

}

export interface SNumber {
    type: "number";
    value: number;
}

export interface SString {
    type: "string";
    value: string;
}
