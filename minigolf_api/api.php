<?php

include_once "php/lib.php";
include_once "php/hash.php";

function toJson( $result ) {
	if(is_array($result)){
            $resultArray = $result->fetch_all(MYSQLI_ASSOC);
        }
        return json_encode($resultArray);
}

function action( $action ) {
   switch( $action ) {
	case "courses":
		return toJson( getCourses() );
 	case "courseScores":
                if( ! isset( $_REQUEST['id'] ) ) {
			return json_encode( array("Error" =>"NoID") );
		}
		$id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
		return toJson( getCourseScores( $id ) );
	case "courseInfo":
                if( ! isset( $_REQUEST['id'] ) ) {
			return json_encode( array("Error" =>"NoID") );
		}
		$id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
		return toJson( getCourseInfo( $id ) );
	case "courseInfoXML":
                if( ! isset( $_REQUEST['id'] ) ) {
			return json_encode( array("Error" =>"NoID") );
		}
		$id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
 		$res = getCourseInfo( $id );
		$record = $res->fetch_assoc();

   		$Result = "<?xml version='1.0' encoding='utf-8'?>\n<Anlage>\n";
  		foreach($record as $key => $value) {
    			$Result .=  "  <$key>$value</$key>\n";
  		}
		$Result .= "</Anlage>\n";
    		return $Result;
	case "users":
		return toJson( getUsers() );
	case "userInfo":
                if( ! isset( $_REQUEST['id'] ) ) {
			return json_encode( array("Error" =>"NoID") );
		}
		$id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
		return toJson( getUserPublicInfo( $id ) );
 	case "userScores":
                if( ! isset( $_REQUEST['id'] ) ) {
			return json_encode( array("Error" =>"NoID") );
		}
		$id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
		return toJson( getUserScores( $id ) );
 	case "createRound":
	       if(! $_SESSION["loggedIn"] || $_SESSION["loggedIn"] == false ){ 
			return json_encode( array("Error" => "no login" ) );
	       }
 	       $courseId = filter_var( $_REQUEST['courseId'], FILTER_SANITIZE_STRING);
               $roundId = newRound( $_SESSION["userid"], $courseId , "2017-01-01"  );
	       return json_encode( array("roundId" => $roundId ) );

 	case "getHoles":
	       $id = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);
 	       return toJson( getHoles( $id ) );

 	case "writeHole":
	       if(! $_SESSION["loggedIn"] || $_SESSION["loggedIn"] == false ){ 
			return json_encode( array("Error" => "no login" ) );
	       }
 		$roundId = filter_var( $_REQUEST['roundId'], FILTER_SANITIZE_STRING);
		$hole    = filter_var( $_REQUEST['hole'], FILTER_SANITIZE_STRING);
		$strikes = filter_var( $_REQUEST['strikes'], FILTER_SANITIZE_STRING);
		writeHole( $roundId, $hole, $strikes );
		return;
	case "login":
                if( ! isset( $_REQUEST['email'] ) || ! isset( $_REQUEST['passwd'] )) {
			return json_encode( array("Error" =>"not enough information") );
		}
		$email  = filter_var( $_REQUEST['email'], FILTER_SANITIZE_STRING);
		$passwd = filter_var( $_REQUEST['passwd'], FILTER_SANITIZE_STRING);
                if(  loginCheck($email, $passwd) ) { 
			return json_encode( array("Message" => "logged in"  ) );
		} else {
			return json_encode( array("Error" => "login failed",
                                                  "email" => $email  ) );
		}
       case "pairsResult":
	        $name   = filter_var( $_REQUEST['name'], FILTER_SANITIZE_STRING);
	        $tries  = filter_var( $_REQUEST['tries'], FILTER_SANITIZE_STRING);
	        $time   = filter_var( $_REQUEST['time'], FILTER_SANITIZE_STRING);
                $r = writePairsResult( $name, $tries, $time );
                return json_encode( array("Result" => "pairs " . $name . $tries . $time  ) );;
       default:
    		return json_encode( array("Error" => "unknown request: " .  $action ) );
	
    }
}

session_start(); 
if(!isset($_SESSION["loggedIn"])){
	$_SESSION["loggedIn"] = false;
} 

if( isset(  $_REQUEST['action'] ) ) {
    $action = filter_var( $_REQUEST['action'], FILTER_SANITIZE_STRING);
    $content = action( $action );
 
} else {
    $app_info = array(
        "appName" => "MiniGolf Manager", 
	"apiVersion" => "0.1"); 

    $content= json_encode($app_info); 
} 

echo $content;
?> 
