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

; ── Built-in Dirac / gamma-matrix objects ────────────────────────────────────
; These must come before the generic function_call / identifier rules.

((function_call function: (identifier) @function.builtin)
  (#match? @function.builtin "(?i)^(g_|g5_|g6_|g7_|gi_|e_|d_|delta_|deltap_|dd_|trace4|tracen)$"))

((identifier) @function.builtin
  (#match? @function.builtin "(?i)^(g_|g5_|g6_|g7_|gi_|e_|d_|delta_|deltap_|dd_|trace4|tracen)$"))

; ── Built-in mathematical / utility functions ─────────────────────────────────

((function_call function: (identifier) @function.builtin)
  (#match? @function.builtin "(?i)^(abs_|fac_|invfac_|bernoulli_|binom_|root_|sign_|sig_|max_|min_|mod_|mod2_|div_|rem_|gcd_|sum_|sump_|theta_|thetap_|count_|nterms_|nargs_|match_|putfirst_|reverse_|perm_|ranperm_|distrib_|partitions_|node_|table_|tbl_|content_|numfactors_|factorin_|maxpowerof_|minpowerof_|denom_|dum_|integer_|id_|sqrt_|ln_|eexp_|sin_|cos_|tan_|asin_|acos_|atan_|atan2_|sinh_|cosh_|tanh_|asinh_|acosh_|atanh_|li2_|gamma_|agm_|euler_|mzv_|mzvhalf_|prime_|exteuclidean_|moebius_|exp_|float_|inverse_|mul_|sizeof_|term_|termsin_|termsinbracket_|firstterm_|firstbracket_|conjg_)$"))

((identifier) @function.builtin
  (#match? @function.builtin "(?i)^(abs_|fac_|invfac_|bernoulli_|binom_|root_|sign_|sig_|max_|min_|mod_|mod2_|div_|rem_|gcd_|sum_|sump_|theta_|thetap_|count_|nterms_|nargs_|match_|putfirst_|reverse_|perm_|ranperm_|distrib_|partitions_|node_|table_|tbl_|content_|numfactors_|factorin_|maxpowerof_|minpowerof_|denom_|dum_|integer_|id_|sqrt_|ln_|eexp_|sin_|cos_|tan_|asin_|acos_|atan_|atan2_|sinh_|cosh_|tanh_|asinh_|acosh_|atanh_|li2_|gamma_|agm_|euler_|mzv_|mzvhalf_|prime_|exteuclidean_|moebius_|exp_|float_|inverse_|mul_|sizeof_|term_|termsin_|termsinbracket_|firstterm_|firstbracket_|conjg_)$"))

; ── Built-in constants ────────────────────────────────────────────────────────

((identifier) @constant.builtin
  (#match? @constant.builtin "(?i)^(i_|pi_|ee_|em_|coeff_|num_|den_|extrasymbols_)$"))

; ── Built-in pattern-match sets ───────────────────────────────────────────────

((identifier) @type.builtin
  (#match? @type.builtin "(?i)^(int_|pos_|pos0_|neg_|neg0_|symbol_|fixed_|index_|vector_|number_|even_|odd_|dummyindices_)$"))

; ── Generic identifiers (lower priority) ─────────────────────────────────────

(function_call
  function: (identifier) @function)

(identifier) @variable
(number) @number
(string) @string

(operator) @operator

[ ";" ] @punctuation.delimiter
[ "," ] @punctuation.delimiter
[ "(" ")" "[" "]" "{" "}" ] @punctuation.bracket
