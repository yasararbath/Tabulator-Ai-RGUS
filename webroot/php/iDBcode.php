<?php
include('./connection.php');
include('./dummy_data.php');
$query = "SELECT * FROM users";
$exist = 0;

if(isset($_POST["recBY"])){ // send a post with recBY that it is the row's favourite data
    $query .= " WHERE favourite = '$_POST[recBY]'";
    $exist++;
}

if(isset($_POST["recBY_fixedVal"])){  // send a post with recBY_fixedVal that it is a value = male
    if($exist)
        $query .= " AND gender = '$_POST[recBY_fixedVal]'";
    else
        $query .= " WHERE gender = '$_POST[recBY_fixedVal]'";
}

$query .= " LIMIT 0, 100";
$result = $conn->query($query);

$dbRows = [];
while ($row = $result->fetch_assoc()) {
    $row['chbox'] = rand(0, 1);
    $row['chbox2'] = rand(0, 1);
    $row['manuf'] = $dummy_data["cameraManufacturers"][array_rand($dummy_data["cameraManufacturers"])];            
    $dbRows[] = $row;
}



$response = [
    'dbRows' => $dbRows
];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($response);

$conn->close();
exit();
?>