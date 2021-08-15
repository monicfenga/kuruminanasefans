<?php
header("Content-type:text/html;charset=utf-8");

$dir = __DIR__;
$file_arr = scandir($dir);
unset($file_arr[0]);
unset($file_arr[1]);
$file_arr = array_values($file_arr);

$n = count($file_arr);
for ($i = 0; $i < $n; ++$i){
    $title = sprintf('color_%02s', $i + 1);
    $old_file_name = $dir."/".$file_arr[$i];
    echo(
        '{'
        .'"location": "'.$old_file_name.'",'
        .'"title": ""'
        .'},'
    );
}