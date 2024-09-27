<?php

// for local host usage
//$servername = "localhost";
//$username = "root";
//$password = "123";
//$dbname = "tabulator";

$servername = "15.204.211.177";
$username = "mydev_accnt2";
$password = "c69Lixxhec&8ZTLPnY%Ct*Y4";
$dbname = "test_tabu_db";



// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}