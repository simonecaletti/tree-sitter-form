(comment) @comment

(preprocessor
  "#" @punctuation.special
  name: (identifier) @keyword.directive)

(dot_directive
  "." @punctuation.special
  name: (identifier) @keyword.directive)

(preprocessor args: (rest_of_line) @string.special)

(declaration_keyword) @keyword.type
(control_keyword) @keyword.control
(statement_keyword) @keyword

(dollar_variable
  "$" @punctuation.special
  (identifier) @variable.special)

(wildcard) @operator

(function_call
  function: (identifier) @function)

(identifier) @variable
(number) @number
(string) @string

(operator) @operator

[ ";" ] @punctuation.delimiter
[ "," ] @punctuation.delimiter
[ "(" ")" "[" "]" "{" "}" ] @punctuation.bracket
