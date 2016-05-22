<?php

$data = file_get_contents('mention.json');
$arr = json_decode(trim($data));
print_r($arr);
