<?php
    $_POST = json_decode(file_get_contents("php://input"), true);

    $servername = "localhost";
    $username = "cu-hauensteinluis01_developer";
    $password = $_POST["passwordPost"];
    $dbName = "cu-hauensteinluis01_BEST";

    //user score entry vars
    $name = $_POST["namePost"];
    $score = $_POST["scorePost"];
    $time = $_POST["timePost"];
    
    //Make connection
    $conn = new mysqli($servername, $username, $password, $dbName);
    
    //Check Connection
    if(!$conn) 
    {
        die("Connection failed.". myssqli_connect_error());
    }
    
    //sql query
    $sql = "INSERT INTO leaderboard (uniqueID, name, score, time) VALUES (NULL, '$name', '$score', '$time')";
    $result = mysqli_query($conn, $sql);

    if(!result) echo "--ERROR--";
    else echo "--SUCCESS--";
?>