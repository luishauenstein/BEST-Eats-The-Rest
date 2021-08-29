<?php
  $servername = "localhost";
  $username = "cu-hauensteinluis01_developer";
  $password = "C2p%z1e3";
  $dbName = "cu-hauensteinluis01_BEST";
  
  //Make connection
  $conn = new mysqli($servername, $username, $password, $dbName);
  
  //Check Connection
  if(!$conn) 
  {
    die("Connection failed.". myssqli_connect_error());
  }
  
  //sql query
  $sql = "SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100";
  $result = mysqli_query($conn, $sql);

  if(mysqli_num_rows($result) > 0)
  {
    //show  data for each row
    while($row = mysqli_fetch_assoc($result))
    {
      $rows[] = $row;
    }
    echo json_encode($rows);
  }

  /*
  if(mysqli_num_rows($result) > 0)
  {
    //show  data for each row
    while($row = mysqli_fetch_assoc($result))
    {
      echo $row['name'] . "-" . $row['score']. "-" . $row['time'] . ";";
    }
  }*/
?>