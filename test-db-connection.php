<?php
echo "Testing database connection using PHP...\n";

$host = 'auth-db1555.hstgr.io';
$user = 'u632940212_fas';
$password = 'Soni@2k25$$';
$database = 'u632940212_son';
$port = 3306;

echo "Host: $host\n";
echo "User: $user\n";
echo "Database: $database\n";
echo "Port: $port\n";

// Create connection
$conn = new mysqli($host, $user, $password, $database, $port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "\n");
}

echo "Connected successfully\n";

// Test query
$sql = "SELECT 1 as test";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "Query successful: " . $row["test"] . "\n";
} else {
    echo "Query returned no results\n";
}

$conn->close();

echo "Database test completed\n";
?>