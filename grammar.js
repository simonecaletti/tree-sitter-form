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
    /[ \t\r\f]+/,
    $.comment,
    // Newlines are significant only for comments, so we keep them in extras
    // but do NOT include them here — the comment rule handles the newline context.
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
      /\n+/
    ),

    // FORM: a line whose very first character is `*` is a comment.
    // The regex uses the multiline ^ anchor.
    comment: _ => token(/\*[^\n]*/),

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

    bare_expression: $ => seq($.expression_list, ";"),

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
      ci("S"), ci("Symbol"), ci("Symbols"),
      ci("V"), ci("Vector"), ci("Vectors"),
      ci("I"), ci("Index"), ci("Indices"),
      ci("F"), ci("Function"), ci("Functions"),
      ci("CF"), ci("CFunction"), ci("CFunctions"),
      ci("NF"), ci("NFunction"), ci("NFunctions"),
      ci("CTensor"), ci("CTensors"),
      ci("Tensor"), ci("Tensors"),
      ci("Set"),
      ci("Table"), ci("NTable"), ci("FTable"),
      ci("Auto"),
      ci("Dimension"),
      ci("ExtraSymbols"),
    ),

    statement_keyword: _ => choice(
      ci("Local"), ci("Global"),
      ci("L"), ci("G"),
      ci("Id"), ci("Identify"),
      ci("Also"),
      ci("AntiBracket"),
      ci("Argument"), ci("EndArgument"),
      ci("Bracket"), ci("UnBracket"),
      ci("Collect"),
      ci("Drop"), ci("Keep"),
      ci("Multiply"),
      ci("Print"), ci("PrintTable"),
      ci("Format"),
      ci("Hide"), ci("Unhide"),
      ci("Skip"), ci("SkipSet"),
      ci("ModuleOption"),
      ci("PolyRatFun"), ci("PolyFun"),
      ci("Sum"),
      ci("SplitArg"), ci("MergeArg"),
      ci("Select"),
      ci("Replace"),
      ci("Normalize"),
      ci("ToPolynomial"),
      ci("FactArg"),
      ci("ChainIn"), ci("ChainOut"),
      ci("Trace4"), ci("TraceN"),
      ci("Metric"),
    ),

    control_keyword: _ => choice(
      ci("If"), ci("ElseIf"), ci("Else"), ci("EndIf"),
      ci("Repeat"), ci("EndRepeat"),
      ci("Do"), ci("EndDo"),
      ci("Switch"), ci("Case"), ci("Default"), ci("EndSwitch"),
      ci("While"), ci("EndWhile"),
      ci("Inside"), ci("EndInside"),
      ci("InExpression"), ci("EndInExpression"),
      ci("GoTo"), ci("Label"),
      ci("Exit"),
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
