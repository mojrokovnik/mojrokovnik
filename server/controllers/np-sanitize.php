<?php

/*
 * Function for stripping out malicious bits
 * 
 * @param {string} $input
 * @return {string} $output
 */

function cleanInput($input) {
    $search = array(
        '@<script[^>]*?>.*?</script>@si', // Strip out javascript
        '@<[\/\!]*?[^<>]*?>@si', // Strip out HTML tags
        '@<style[^>]*?>.*?</style>@siU', // Strip style tags properly
        '@<![\s\S]*?--[ \t\n\r]*>@' // Strip multi-line comments
    );

    $output = preg_replace($search, '', $input);
    return $output;
}

/*
 * Sanitization function
 * 
 * @param {string} $input
 * @return {string} $output
 */

function sanitize($input, $mysqli) {
    $output = '';
    if (is_array($input)) {
        foreach ($input as $var => $val) {
            $output[$var] = sanitize($val, $mysqli);
        }
    } else {
        if (get_magic_quotes_gpc()) {
            $input = stripslashes($input);
        }
        $input = cleanInput($input);
        $output = mysqli_real_escape_string($mysqli, $input);
    }

    return $output;
}
