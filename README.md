# tree-sitter-form

A Tree-sitter grammar for the [FORM](https://www.nikhef.nl/~form/) symbolic manipulation language.

## Supported constructs

- **Comments** — lines whose first character is `*` (a `*` after whitespace is multiplication)
- **Preprocessor directives** — `#define`, `#include`, `#procedure`/`#endprocedure`, `#call`, `#if`, etc.
- **Dot directives** — `.sort`, `.end`, `.global`, etc.
- **Declarations** — `Symbols`, `Vectors`, `Indices`, `Functions`, `CFunctions`, `NFunctions`, `Tensors`, `CTensors`, `Table`, `Set`, `Dimension`, `ExtraSymbols`, and their short forms
- **Statements** — `Local`, `Global`, `Id`, `IdNew`, `IdOld`, `Multiply`, `Print`, `Bracket`, `Collect`, `Contract`, `Chisholm`, `Symmetrize`, `AntiSymmetrize`, `ToPolynomial`, `FromPolynomial`, `FactArg`, `FactDollar`, `Trace4`, `TraceN`, `UnitTrace`, and many more (case-insensitive)
- **Control flow** — `If`/`ElseIf`/`Else`/`EndIf`, `Repeat`/`EndRepeat`, `Do`/`EndDo`, `While`/`EndWhile`, `Switch`/`Case`/`EndSwitch`, `Inside`/`EndInside`, `InExpression`/`EndInExpression`, `Term`/`EndTerm`, `GoTo`/`Label`
- **Built-in functions** — `g_`, `g5_`, `g6_`, `g7_`, `gi_`, `d_`, `e_`, `trace4`, `tracen`, `abs_`, `fac_`, `gcd_`, `sin_`, `cos_`, `sqrt_`, and many more
- **Built-in constants** — `i_`, `pi_`, `ee_`, `em_`, `coeff_`, `num_`, `den_`
- **Built-in sets** — `int_`, `pos_`, `neg_`, `symbol_`, `index_`, `vector_`, `number_`, `even_`, `odd_`
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
```
