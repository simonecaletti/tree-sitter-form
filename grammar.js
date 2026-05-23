/**
 * FORM is case-insensitive for keywords. This helper builds a regex that
 * matches the keyword in any case.
 */
function ci(kw) {
  return new RegExp(
    kw.split("").map(c =>
      /[a-zA-Z]/.test(c) ? `[${c.toLowerCase()}${c.toUpperCase()}]` : c
    ).join("")
  );
}

const PREC = {
  call: 2,
};

module.exports = grammar({
  name: "form",

  extras: $ => [
    /[ \t\r\f\n]+/,
  ],

  word: $ => $.identifier,

  conflicts: $ => [
    [$.statement, $._atom],
    [$.expression_list],
  ],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.comment,
      $.preprocessor,
      $.dot_directive,
      $.declaration,
      $.statement,
      $.bare_expression,
    ),

    // A comment is a `*` followed by the rest of the line.
    // prec(2) ensures this beats the `*` operator token when both are valid.
    // It is safe because `*` at _item level can only ever be a comment
    // (bare_expression/statement never start with `*`).
    comment: _ => token(prec(2, /\*[^\n]*/)),

    // #directive  (rest of line is free-form)
    preprocessor: $ => seq(
      "#",
      field("name", $.identifier),
      optional(field("args", $.rest_of_line))
    ),

    // .directive [args]
    dot_directive: $ => seq(
      ".",
      field("name", $.identifier),
      optional(field("args", $.rest_of_line))
    ),

    // Free-form content until end-of-line — used by preprocessor and dot_directive.
    rest_of_line: _ => token(/[^\n]+/),

    declaration: $ => seq(
      field("keyword", $.declaration_keyword),
      optional(field("body", $.expression_list)),
      ";"
    ),

    statement: $ => seq(
      field("keyword", choice($.statement_keyword, $.control_keyword, $.identifier)),
      optional(field("body", $.expression_list)),
      ";"
    ),

    // A bare expression must start with an atom or function call, never an
    // operator. This prevents `*` at column 0 from being consumed as an
    // expression instead of as a comment.
    bare_expression: $ => seq(
      choice($.function_call, $._atom),
      repeat(choice($.function_call, $._atom, $.operator, $.punctuation)),
      ";"
    ),

    expression_list: $ => repeat1(choice(
      $.function_call,
      $._atom,
      $.operator,
      $.punctuation
    )),

    function_call: $ => prec(PREC.call, seq(
      field("function", $.identifier),
      "(",
      optional($.expression_list),
      ")"
    )),

    _atom: $ => choice(
      $.dollar_variable,
      $.wildcard,
      $.identifier,
      $.number,
      $.string
    ),

    // ── Keywords (case-insensitive) ──────────────────────────────────────────

    declaration_keyword: _ => choice(
      token(prec(1, ci("Symbols"))), token(prec(1, ci("Symbol"))), token(prec(1, ci("S"))),
      token(prec(1, ci("Vectors"))), token(prec(1, ci("Vector"))), token(prec(1, ci("V"))),
      token(prec(1, ci("Indices"))), token(prec(1, ci("Index"))), token(prec(1, ci("I"))),
      token(prec(1, ci("CFunctions"))), token(prec(1, ci("CFunction"))), token(prec(1, ci("CF"))),
      token(prec(1, ci("NFunctions"))), token(prec(1, ci("NFunction"))), token(prec(1, ci("NF"))),
      token(prec(1, ci("Functions"))), token(prec(1, ci("Function"))), token(prec(1, ci("F"))),
      token(prec(1, ci("CTensors"))), token(prec(1, ci("CTensor"))),
      token(prec(1, ci("Tensors"))), token(prec(1, ci("Tensor"))),
      token(prec(1, ci("Set"))),
      token(prec(1, ci("NTable"))), token(prec(1, ci("FTable"))), token(prec(1, ci("Table"))),
      token(prec(1, ci("Auto"))),
      token(prec(1, ci("Dimension"))),
      token(prec(1, ci("ExtraSymbols"))),
    ),

    statement_keyword: _ => choice(
      token(prec(1, ci("Local"))), token(prec(1, ci("Global"))),
      token(prec(1, ci("L"))), token(prec(1, ci("G"))),
      token(prec(1, ci("Identify"))), token(prec(1, ci("IdNew"))), token(prec(1, ci("IdOld"))), token(prec(1, ci("Id"))),
      token(prec(1, ci("Also"))),
      token(prec(1, ci("AntiBracket"))),
      token(prec(1, ci("EndArgument"))), token(prec(1, ci("Argument"))),
      token(prec(1, ci("UnBracket"))), token(prec(1, ci("Bracket"))),
      token(prec(1, ci("Collect"))),
      token(prec(1, ci("Drop"))), token(prec(1, ci("Keep"))),
      token(prec(1, ci("Multiply"))),
      token(prec(1, ci("PrintTable"))), token(prec(1, ci("Print"))),
      token(prec(1, ci("Format"))),
      token(prec(1, ci("Unhide"))), token(prec(1, ci("Hide"))),
      token(prec(1, ci("SkipSet"))), token(prec(1, ci("Skip"))),
      token(prec(1, ci("ModuleOption"))),
      token(prec(1, ci("PolyRatFun"))), token(prec(1, ci("PolyFun"))),
      token(prec(1, ci("Sum"))),
      token(prec(1, ci("SplitArg"))), token(prec(1, ci("MergeArg"))),
      token(prec(1, ci("Select"))),
      token(prec(1, ci("Replace"))), token(prec(1, ci("ReplaceLoop"))),
      token(prec(1, ci("Normalize"))),
      token(prec(1, ci("ToPolynomial"))), token(prec(1, ci("FromPolynomial"))),
      token(prec(1, ci("FactArg"))), token(prec(1, ci("FactDollar"))),
      token(prec(1, ci("ChainIn"))), token(prec(1, ci("ChainOut"))),
      token(prec(1, ci("Trace4"))), token(prec(1, ci("TraceN"))),
      token(prec(1, ci("UnitTrace"))),
      token(prec(1, ci("Metric"))),
      token(prec(1, ci("Contract"))),
      token(prec(1, ci("Chisholm"))),
      token(prec(1, ci("RCycleSymmetrize"))), token(prec(1, ci("CycleSymmetrize"))),
      token(prec(1, ci("AntiSymmetrize"))), token(prec(1, ci("Symmetrize"))),
      token(prec(1, ci("Disorder"))),
      token(prec(1, ci("Denominators"))),
      token(prec(1, ci("DropSymbols"))), token(prec(1, ci("DropCoefficient"))),
      token(prec(1, ci("ArgToExtraSymbol"))), token(prec(1, ci("ArgImplode"))), token(prec(1, ci("ArgExplode"))),
      token(prec(1, ci("Apply"))),
    ),

    control_keyword: _ => choice(
      token(prec(1, ci("ElseIf"))), token(prec(1, ci("Else"))),
      token(prec(1, ci("EndIf"))), token(prec(1, ci("If"))),
      token(prec(1, ci("EndRepeat"))), token(prec(1, ci("Repeat"))),
      token(prec(1, ci("EndDo"))), token(prec(1, ci("Do"))),
      token(prec(1, ci("EndSwitch"))), token(prec(1, ci("Switch"))),
      token(prec(1, ci("Case"))), token(prec(1, ci("Default"))),
      token(prec(1, ci("EndWhile"))), token(prec(1, ci("While"))),
      token(prec(1, ci("EndInside"))), token(prec(1, ci("Inside"))),
      token(prec(1, ci("EndInExpression"))), token(prec(1, ci("InExpression"))),
      token(prec(1, ci("EndTerm"))), token(prec(1, ci("Term"))),
      token(prec(1, ci("GoTo"))), token(prec(1, ci("Label"))),
      token(prec(1, ci("Exit"))),
    ),

    // ── Atoms ────────────────────────────────────────────────────────────────

    dollar_variable: $ => seq("$", $.identifier),

    // Named wildcard: ?name or ??name, or bare ? / ??
    wildcard: _ => choice(
      token(seq("??", /[A-Za-z_][A-Za-z0-9_]*/)),
      token(seq("?", /[A-Za-z_][A-Za-z0-9_]*/)),
      "??",
      "?",
    ),

    operator: _ => choice(
      "+", "-", "*", "/", "^",
      "=", "==", "!=", "<>",
      "<=", ">=", "<", ">",
      "&&", "||", "!",
    ),

    punctuation: _ => choice(
      ",", ":", "::", "...",
      "(", ")", "[", "]", "{", "}",
    ),

    identifier: _ => /[A-Za-z_][A-Za-z0-9_]*/,

    number: _ => /[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?/,

    string: _ => token(seq(
      '"',
      repeat(choice(/[^"\\]/, /\\./)),
      '"'
    )),
  }
});
