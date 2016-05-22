<?php

$data = file_get_contents('topics.json');
$arr = json_decode(trim($data));
$docs = $arr->response->docs;

$url = "http://redmine.choiweb.xyz:8983/solr/testdata2/update?wt=json";
foreach($docs as $doc) {
	unset($doc->_version_);
	$data = json_encode($doc, JSON_UNESCAPED_SLASHES);
	echo $data."\n\n";
	$return = sendPostData($url, $data);
	print_r($return);
	exit();
}


function sendPostData($url, $post){
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POSTFIELDS,$post);
  curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                                            'Content-Type: application/json',
                                            'Connection: Keep-Alive'
                                            ));
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); 
  $result = curl_exec($ch);
  curl_close($ch);  // Seems like good practice
  return $result;
}