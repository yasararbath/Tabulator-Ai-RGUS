<?php

include('./connection.php');

// Get the request parameters
$name = isset($_GET['name']) ? $_GET['name'] : null;
$email = isset($_GET['email']) ? $_GET['email'] : null;
$phone_number = isset($_GET['phone_number']) ? $_GET['phone_number'] : null;
$location = isset($_GET['location']) ? $_GET['location'] : null;
$gender = isset($_GET['gender']) ? $_GET['gender'] : null;
$favourite = isset($_GET['favourite']) ? $_GET['favourite'] : null;
$dob = isset($_GET['dob']) ? $_GET['dob'] : null;
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : null;
$per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 200;
$page = isset($_GET['page']) ? intval($_GET['page']) : 1;

// Build the base query
$query = "SELECT * FROM users WHERE 1=1";
$totalQuery = "SELECT COUNT(*) as total FROM users WHERE 1=1";

if ($name) {
    $query .= " AND name LIKE '%" . $conn->real_escape_string($name) . "%'";
    $totalQuery .= " AND name LIKE '%" . $conn->real_escape_string($name) . "%'";
}
if ($email) {
    $query .= " AND email LIKE '%" . $conn->real_escape_string($email) . "%'";
    $totalQuery .= " AND email LIKE '%" . $conn->real_escape_string($email) . "%'";
}
if ($phone_number) {
    $query .= " AND phone_number LIKE '%" . $conn->real_escape_string($phone_number) . "%'";
    $totalQuery .= " AND phone_number LIKE '%" . $conn->real_escape_string($phone_number) . "%'";
}
if ($location) {
    $query .= " AND location LIKE '%" . $conn->real_escape_string($location) . "%'";
    $totalQuery .= " AND location LIKE '%" . $conn->real_escape_string($location) . "%'";
}
if ($gender) {
    $query .= " AND gender LIKE '" . $conn->real_escape_string($gender) . "'";
    $totalQuery .= " AND gender LIKE '" . $conn->real_escape_string($gender) . "'";
}
if ($favourite) {
    $query .= " AND favourite LIKE '%" . $conn->real_escape_string($favourite) . "%'";
    $totalQuery .= " AND favourite LIKE '%" . $conn->real_escape_string($favourite) . "%'";
}
if ($dob) {
    $query .= " AND dob = '" . $conn->real_escape_string($dob) . "'";
    $totalQuery .= " AND dob = '" . $conn->real_escape_string($dob) . "'";
}

// Sorting
if ($sort_by) {
    $sorts = explode(',', $sort_by);
    $orderClauses = [];
    foreach ($sorts as $sort) {
        list($field, $direction) = explode(':', $sort);
        $field = $conn->real_escape_string($field);
        $direction = $conn->real_escape_string($direction);
        if (in_array($field, ['id', 'name', 'email', 'phone_number', 'dob', 'location', 'gender', 'favourite']) && in_array($direction, ['asc', 'desc'])) {
            $orderClauses[] = "$field $direction";
        }
    }
    if (!empty($orderClauses)) {
        $query .= " ORDER BY " . implode(', ', $orderClauses);
    }
}

// Pagination
$offset = ($page - 1) * $per_page;
$query .= " LIMIT $offset, $per_page";

// Get the total number of records
$totalResult = $conn->query($totalQuery);
$total = $totalResult->fetch_assoc()['total'];
$total_pages = ceil($total / $per_page);

// Execute the query
$result = $conn->query($query);

$users = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
}

// Prepare pagination URLs
$base_url = strtok($_SERVER["REQUEST_URI"], '?');
parse_str($_SERVER['QUERY_STRING'], $queryParams);
unset($queryParams['page']); // Remove existing page parameter if any
$queryString = http_build_query($queryParams);

$next_page_url = $page < $total_pages ? $base_url . '?' . $queryString . '&page=' . ($page + 1) : null;
$prev_page_url = $page > 1 ? $base_url . '?' . $queryString . '&page=' . ($page - 1) : null;
$first_page_url = $base_url . '?' . $queryString . '&page=1';
$last_page_url = $base_url . '?' . $queryString . '&page=' . $total_pages;

// Pagination Links
$links = [];
// if ($page > 1) {
//     $links[] = ["url" => $prev_page_url, "label" => "&laquo; Previous", "active" => false];
// }
// for ($i = 1; $i <= $total_pages; $i++) {
//     $links[] = ["url" => $base_url . '?' . $queryString . '&page=' . $i, "label" => (string)$i, "active" => $i == $page];
// }
// if ($page < $total_pages) {
//     $links[] = ["url" => $next_page_url, "label" => "Next &raquo;", "active" => false];
// }

// Prepare the response
$response = [
    'current_page' => $page,
    // 'data' => $users,
    'dtRows' => $users,
    'first_page_url' => $_SERVER['SERVER_NAME'] . $first_page_url,
    'from' => $offset + 1,
    'last_page' => $total_pages,
    'last_page_url' => $_SERVER['SERVER_NAME'] . $last_page_url,
    'links' => $links,
    'next_page_url' => $_SERVER['SERVER_NAME'] . $next_page_url,
    'path' => $_SERVER['SERVER_NAME'] . $base_url,
    'per_page' => $per_page,
    'prev_page_url' => $_SERVER['SERVER_NAME'] . $prev_page_url,
    'to' => min($offset + $per_page, $total),
    'total' => $total
];

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
echo json_encode($response);

$conn->close();
?>