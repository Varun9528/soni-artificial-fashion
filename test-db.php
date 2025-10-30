<?php
echo "Testing database connection using PHP...\n";

$host = '193.203.184.115';
$user = 'u632940212_son';
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
$sql = "SELECT COUNT(*) as count FROM products";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "Found " . $row["count"] . " products in the database\n";
} else {
    echo "0 products found\n";
}

$conn->close();

echo "Database test completed\n";
?>