# tree-sitter-form

A Tree-sitter grammar for the [FORM](https://www.nikhef.nl/~form/) symbolic manipulation language.

## Supported constructs

- **Comments** — lines starting with `*`
- **Preprocessor directives** — `#define`, `#include`, `#procedure`, etc.
- **Dot directives** — `.sort`, `.end`, `.global`, etc.
- **Declarations** — `Symbols`, `Vectors`, `Indices`, `Functions`, `CFunctions`, `Tensors`, `Table`, and their short forms
- **Statements** — `Local`, `Global`, `Id`, `Multiply`, `Print`, `Bracket`, `Collect`, and many more
- **Control flow** — `If`/`ElseIf`/`Else`/`EndIf`, `Repeat`/`EndRepeat`, `Do`/`EndDo`, `While`/`EndWhile`, `Switch`/`Case`/`EndSwitch`
- **Dollar variables** — `$name`
- **Wildcards** — `?`, `??`, `?name`, `??name`
- **Function calls** — `f(x, y)`
- **Operators** — arithmetic, comparison, logical
- **Numbers** — integers, decimals, scientific notation (`1.5e-3`)
- **Strings** — `"..."`

All keywords are matched case-insensitively (`if`, `If`, `IF` are all valid).

## Development

```bash
npm install          # install tree-sitter-cli
npm run generate     # regenerate src/parser.c from grammar.js
npm test             # run corpus tests
npm run parse-example  # parse examples/basic.frm
```

## Known limitations

The `*` character is both the line-comment marker (when it appears at the start of a line) and the multiplication operator. Distinguishing the two correctly requires a stateful external scanner. The current grammar treats `*` as an operator inside expressions, but a bare `*` at the start of a line may be misidentified. An external scanner is the proper fix.
