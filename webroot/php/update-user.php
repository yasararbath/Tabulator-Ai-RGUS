<?php

include('./connection.php');

try {
    header('Access-Control-Allow-Origin: *');
    // header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Methods: *');
    
    $data = json_decode(file_get_contents('php://input'), true);
    $response = [];
    
    if (isset($data['updates'])) {
      if($data['updates'][0]['id'] > 10000)  {
          unset($data['updates'][0]['id']);
          unset($data['updates'][0]['children']);
          unset($data['updates'][0]['isCurrentRow']);
          $keys = implode(", ", array_keys($data['updates'][0]));
          $values = "'".implode("', '", array_values($data['updates'][0]))."'";
          $query = "INSERT INTO users ($keys) VALUES ($values)";
          if ($conn->query($query) === TRUE) {
            $response = ['success' => 1, 'msg' => 'Users have been updated successfully.'];
          } else {
            $response[] = ['error' => "Error updating record: " . $conn->error];
          }          
      } else {
        foreach ($data['updates'] as $input) {
            if(!empty($input)) {
                $query = "UPDATE users SET ";
                $totalFields = count($input) - 1;
                $count = 1;
                foreach ($input as $field => $val) {
                    if($field == 'isCurrentRow') {
                        continue;
                    }
                    if($field != 'id') {
                        $query .= "$field = '$val' ";
                        if($count < $totalFields) {
                            $query .= ", ";
                            $count++;
                        }
                    } else if($field == 'dob') {
                        $val = date('Y-m-d', strtotime($val));
                        $query .= "$field = $val ";
                    }
                }
                $id = $input['id'];
                $query = trim($query, ", ");
                $query .= "WHERE id = $id;";
                // echo $query;die;
                if ($conn->query($query) === TRUE) {
                    $response = ['success' => 1, 'msg' => 'Users have been updated successfully.'];
                } else {
                    $response[] = ['error' => "Error updating record: " . $conn->error];
                }
            }
        }
      }
    } else {
        $response[] = ['error' => "No updates provided."];
    }
    
    header("Access-Control-Allow-Headers: X-Requested-With");
    echo json_encode($response);
    
    $conn->close();
} catch (\Throwable $th) {
    echo json_encode($th);die;
}
?>
