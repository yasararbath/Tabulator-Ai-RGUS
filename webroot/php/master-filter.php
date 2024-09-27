<?php

include('./connection.php');


try {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: *');
    header("Access-Control-Allow-Headers: X-Requested-With");
    // Get search parameters
    $searchTerm = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $columns = isset($_GET['columns']) ? $_GET['columns'] : '';
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
    
    $response = [];
    // Validate columns parameter
    $validColumns = ['name', 'email', 'phone_number', 'location', 'gender', 'favourite', 'dob'];
    if (!empty($columns)) {
        $columns = explode(',', $columns);
        foreach ($columns as $column) {
            if (!in_array($column, $validColumns)) {
                die(json_encode(['error' => 'Invalid column name provided']));
            }
        }
    } else {
        $columns = $validColumns; // Default to search all columns if none provided
    }
    // Pagination calculations
    $offset = ($page - 1) * $per_page;
    
    // Build query
    $query = "SELECT * FROM users WHERE ";
    if (strpos($searchTerm, '*') !== false) {
        $searchTerm = str_replace('*', '%', $searchTerm);
        $conditions = [];
        foreach ($columns as $column) {
            $conditions[] = "$column LIKE '$searchTerm'";
        }
        $query .= implode(' OR ', $conditions);
    } else {
        $conditions = [];
        foreach ($columns as $column) {
            $conditions[] = "$column LIKE '%$searchTerm%'";
        }
        $query .= implode(' OR ', $conditions);
    }
    
    // Get total count
    $count_query = str_replace('SELECT *', 'SELECT COUNT(*) as total', $query);
    $count_result = $conn->query($count_query);
    $total = $count_result->fetch_assoc()['total'];
    $total_pages = ceil($total / $per_page);
    
    // Add limit for pagination
    $query .= " LIMIT $offset, $per_page";
    
    $result = $conn->query($query);
    
    $users = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    
    // Generate pagination links
    $base_url = strtok($_SERVER["REQUEST_URI"], '?');
    $first_page_url = $base_url . '?page=1';
    $last_page_url = $base_url . '?page=' . $total_pages;
    $next_page_url = $page < $total_pages ? $base_url . '?page=' . ($page + 1) : null;
    $prev_page_url = $page > 1 ? $base_url . '?page=' . ($page - 1) : null;
    
    // Build response
    $response = [
        'current_page' => $page,
        'data' => $users,
        'first_page_url' => $_SERVER['SERVER_NAME'] . $first_page_url,
        'from' => $offset + 1,
        'last_page' => $total_pages,
        'last_page_url' => $_SERVER['SERVER_NAME'] . $last_page_url,
        'links' => [],
        'next_page_url' => $next_page_url ? $_SERVER['SERVER_NAME'] . $next_page_url : null,
        'path' => $_SERVER['SERVER_NAME'] . $base_url,
        'per_page' => $per_page,
        'prev_page_url' => $prev_page_url ? $_SERVER['SERVER_NAME'] . $prev_page_url : null,
        'to' => min($offset + $per_page, $total),
        'total' => $total
    ];
     header("Access-Control-Allow-Headers: X-Requested-With");
    echo json_encode($response);
    
    $conn->close();
} catch (\Throwable $th) {
    echo json_encode($th);
}
?>
