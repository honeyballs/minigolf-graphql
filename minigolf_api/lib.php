<?php 
$mysqli;
$messages = "";

define("salt", "A908sd780sjasdf2kzx3");

function addMessage( $message ) {
	global $messages;
	$messages .= "<span> $message </span>";
}

function hasMessages() {
	global $messages;
	return $messages != "";
}

function getMessages() {
	global $messages;
	return $messages;
}
function connect() {
	global $mysqli;
        require 'config/info.php';
	if( isset( $mysqli ) ) {
		return;
	} 

	$mysqli = new mysqli("localhost", $user, $pwd, $db);
	
	$mysqli->query("SET NAMES 'utf8'");
	if ($mysqli->connect_errno) {
    		echo "MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
		return null;
	} 
	//echo $mysqli->host_info . "<br>\n";
	return $mysqli;
}


function getUsers() {
	global $mysqli;
	connect();
	$sql = "SELECT users.name AS name, clubs.name AS clubname, users.id AS id FROM users JOIN clubs ON club_id=clubs.id";
	return  $mysqli->query($sql);
}

function areFriends( $userId, $friendId ) {
	global $mysqli;
	connect();

	$sql = "SELECT * FROM friends WHERE user1=$userId AND user2=$friendId";
	$result = $mysqli->query($sql);
        return( mysqli_num_rows($result) != 0 );
}

function addFriend( $userId, $email ) {
	global $mysqli;
	connect();
	$email = filter_var($email, FILTER_SANITIZE_EMAIL);
	$sql = "SELECT * FROM users WHERE email='$email'";
	$result = $mysqli->query($sql);
        if( mysqli_num_rows($result) == 0 ) {
		return " Email <em> $email </em>nicht gefunden";
	}
        $friend  = $result->fetch_assoc( );
        $friendId =  $friend['id'];
	if( areFriends( $friendId, $userId ) ) {
		return " Bist schon Freund bei <em>" . $friend['name'] ."</em>";
        }
	$sql = "INSERT INTO friends VALUES (null, $friendId, $userId)";
	$mysqli->query($sql);
	return " Du bist jetzt Freund bei <em>" . $friend['name'] ."</em>";
}

function getFriends( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT users.id AS id, name FROM users JOIN friends  ON users.id=friends.user2 WHERE friends.user1=$userId ";
	return  $mysqli->query($sql);
}

function getHosts( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM users JOIN friends  ON users.id=friends.user1 WHERE friends.user2=$userId ";
	return  $mysqli->query($sql);
}

function getChallenges() {
	global $mysqli;
	connect();
	$sql = "SELECT challenges.name AS name, challenges.date AS date, users.name AS user FROM challenges, user_challenge, users WHERE user_challenge.user_id = users.id AND user_challenge.challenge_id = challenges.id";
	return  $mysqli->query($sql);

}

function createCourse(  $name, $breite, $laenge, $typ, $info ) {
	global $mysqli;
	connect();
        $sql = "INSERT INTO courses ( `name`, `Breitengrad`, `Laengengrad`, `type`, `info`) VALUES ( '$name', $breite, $laenge, $typ, '$info' )";
	return $mysqli->query($sql);
}

function getCourses() {
	global $mysqli;
	connect();
	$sql = "SELECT courses.id, courses.name, courses.Breitengrad, courses.Laengengrad, courses.info, coursetypes.type  FROM courses  JOIN coursetypes  ON courses.type=coursetypes.id";
	return  $mysqli->query($sql);

}

function getCourseTypes() {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM coursetypes";
	return  $mysqli->query($sql);

}

function getCourseInfo( $courseId ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM courses WHERE courses.id=$courseId ";
	return $mysqli->query($sql);
}

function getCourseLines( $courseId ) {
	global $mysqli;
	connect();
        $sql = "SELECT course_line.id AS cl_id, course_line.index, lines.name, lines.id FROM `course_line` JOIN `lines` ON line_id = lines.id WHERE course_id=$courseId ORDER BY course_line.index";
	return $mysqli->query($sql);
}

function getLines() {
	global $mysqli;
	connect();
        $sql = "SELECT * FROM `lines`";
	return $mysqli->query($sql);
}

function addLineForCourse(  $courseId, $index, $line ) {
	global $mysqli;
	connect();
        $sql = "INSERT INTO course_line (course_id, `index`, line_id) VALUES ( $courseId, $index, $line )";
	return $mysqli->query($sql);
}

function deleteLineFromCourse(  $id ) {
	global $mysqli;
	connect();
        $sql = "DELETE FROM `course_line` WHERE id=$id";
        //echo( $sql );
	return $mysqli->query($sql);
}

function setLine( $id, $line ) {
	global $mysqli;
	connect();
        $sql = "UPDATE  course_line set line_id=$line WHERE id=$id";
	return $mysqli->query($sql);
}

function getUserInfo( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM users WHERE users.id=$userId ";
	return $mysqli->query($sql);
}

function getUserPublicInfo( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT name, club_id FROM users WHERE users.id=$userId ";
	return $mysqli->query($sql);
}

function getCourseScores( $courseId ) {
	global $mysqli;
	connect();
	$sql = "SELECT date,users.name,courses.name AS cname,rounds.id AS roundid,users.id AS userid FROM rounds JOIN users ON user_id=users.id JOIN courses ON course_id=courses.id WHERE courses.id=$courseId ORDER BY date DESC";
	return $mysqli->query($sql);
}

function getUserScores( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT date,users.name,courses.name AS cname,rounds.id AS roundid,courses.id AS courseid FROM rounds JOIN users ON user_id=users.id JOIN courses ON course_id=courses.id WHERE users.id=$userId ORDER BY date DESC";
	return $mysqli->query($sql);
}

function getCourseUserScores( $courseId, $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT date,users.name,courses.id AS courseid,rounds.id AS roundid,users.id AS userid FROM rounds JOIN users ON user_id=users.id JOIN courses ON course_id=courses.id WHERE users.id=$userId AND courses.id=$courseId ORDER BY date DESC";
	return $mysqli->query($sql);
}

function getUserRegistrationDate( $userId ) {
	global $mysqli;
	connect();
	$result = $mysqli->query("SELECT registration FROM users WHERE id = $userId");
        return implode( $result->fetch_assoc( ));

}

function getRounds( ) {
	global $mysqli;
	connect();
	$sql = "SELECT date,users.name,courses.name AS cname,rounds.id AS roundid,users.id AS userid, courses.id AS courseid FROM rounds JOIN users ON user_id=users.id JOIN courses ON course_id=courses.id ORDER BY date DESC";

	return  $mysqli->query($sql);

}

function getRoundsForUser( $userId ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM rounds WHERE user_id=$userId" ;
	return  $mysqli->query($sql);

}

function newRound( $userId, $courseId, $date  ) {
	global $mysqli;
	connect();
	$sql = "INSERT INTO rounds (user_id, course_id, date) VALUES ( $userId, $courseId,'$date')";
	$result = $mysqli->query($sql);
        return  $mysqli->insert_id;
}

// eigentlich müsste userId unnötig sein ??
function deleteRound( $roundId, $userId) {
	global $mysqli;
	connect();
	
	$sql = "DELETE FROM rounds WHERE id='$roundId' AND user_id='$userId'";
	//echoBr( $sql );
	if ($mysqli->query($sql) === TRUE) {
    		if( $mysqli->affected_rows ) {
			return "Runde $roundId wurde gel&ouml;scht.";
		} else {
       			return "Runde $roundId konnte nicht gel&ouml;scht werden.";
		}
	} else {
    		return "Fehler: " . $mysqli->error;
	}
}



function getHoles( $roundId ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM holes WHERE round_id=$roundId  ORDER BY hole ASC" ;
	return $mysqli->query($sql);
}

function writeHole( $roundId, $hole, $strokes  ) {
	global $mysqli;
	connect();
	$sql = "INSERT INTO holes (round_id, hole, strokes) VALUES ( $roundId, $hole, $strokes)";
	$r = $mysqli->query($sql);
        return  $r;
}

function writePairsResult( $name, $tries, $time  ) {
	global $mysqli;
	connect();
	$sql = "INSERT INTO results_pairs (name, tries, time) VALUES ( '$name', $tries, $time)";
	$r = $mysqli->query($sql);
        return  $r;
}

function getTopPairResults( $n ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM results_pairs ORDER BY tries, time  LIMIT $n" ;
	return $mysqli->query($sql);
}

function getLatestPairResults( $n ) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM results_pairs ORDER BY timestamp DESC  LIMIT $n" ;
	return $mysqli->query($sql);
}

function getNumberPairResults( ) {
	global $mysqli;
	connect();
	$result = $mysqli->query("SELECT COUNT(*) AS c FROM results_pairs");
	$row = $result->fetch_assoc();
	return $row['c'];
}

function getPairStatistic( ) {
	global $mysqli;
	connect();
	return $mysqli->query("SELECT tries, count( tries ) AS count FROM results_pairs GROUP by tries");
}

function getById( $table, $id) {
	global $mysqli;
	connect();
	$sql = "SELECT * FROM $table WHERE id=$id";
	$result = $mysqli->query($sql);
	return $result->fetch_assoc();
}

function emailExists($email){
	global $mysqli;
	connect();
	$sql = "SELECT users.email AS email FROM users WHERE email = '$email'";
	$result = $mysqli->query($sql);
	$count = 0;
	if($result){
		foreach($result as $row){
			$count++;
			break;
		}
	}
	return $count > 0;
}

function registerUser($email, $name, $pw){
	global $mysqli;
	connect();
	$pwhash = hashen($pw);
 	$regKey = mt_rand( 100000, 999999) ;

	$sql = "INSERT INTO `users` (`name`, `email`,`passwordHash`, `birthday`, `gender`, `logins`, `club_id`, `regKey`) VALUES ('$name', '$email', '$pwhash', '1985-06-08', 'm', 0, 1, $regKey )";
	$mysqli->query($sql);
        addMessage( "neuer Benutzer $name angelegt");

	$betreff = "Anmeldung bei Minigolf";
	$from = "From: Stephan Euler<stephan.euler@mmd.thm.de>";
	$text = "Bitte hier bestätigen: http://hosting.iem.thm.de/user/euler/minigolf/index.php?inhalt=benutzerBestaetigen&user=$name&regKey=$regKey";
 
	mail($email, $betreff, $text, $from);
}

function loginCheck( $email, $password) {
	global $mysqli;
	connect();

	//$sql = "SELECT users.id AS id, users.passwordHash AS pw, users.name AS name FROM users WHERE email='$email'";
	$sql = "SELECT * FROM users WHERE email='$email'";
	$pwhash = hashen($password);
	$result = $mysqli->query($sql)->fetch_assoc();

	if( $result['active'] == '0' ) {
		addMessage( "Benutzer noch nicht best&auml;tigt" );
		return false;
	}
	if (strcmp($pwhash, $result["passwordHash"]) == 0 ){
		$_SESSION["userid"] = $result["id"];
		$_SESSION["username"] = $result["name"];
		$_SESSION["userrole"] = $result["role"];
		$_SESSION["loggedIn"] = true;
		// echo session_id();
		//print_r ($_SESSION);
		return true;
	}
	//$_SESSION["username"] = $pwhash;
	return false;
}

function isLoggedInAs( $userid ) {
	return isset( $_SESSION["userid"]  ) AND $_SESSION["userid"] == $userid;
}

function isLoggedInAsAdmin( ) {
	return isset( $_SESSION["userrole"]  ) AND $_SESSION["userrole"] >= 2;
}

function hashen($text){
    if (function_exists("hash_pbkdf2")) {
	return hash_pbkdf2("sha256", $text, salt , 1000, 20);
    } else {
 	return pbkdf2("sha256", $text, salt , 1000, 20);
   }
}

function echoBr( $text ) {
	echo "$text <br>";
}

function hasLineInfo( $id ) {
	$filename =  "images/thumbs/be$id.jpg";
	return file_exists( $_SERVER["DOCUMENT_ROOT"] . '/minigolf/' . $filename) || 
	file_exists( '/usr3/euler/minigolf/' . $filename);
}

// Funktionen für das Eingabeformular: 
// Anlegen, Abfragen und Löschen einer zufälligen, eindeutigen ID als Kennung für ein gültiges Formular 
function  getRandomFormId( ) {
        global $mysqli;
	connect();
        do {
        	$RID =  mt_rand( 100000, 999999);
	} while( hasRandomFormId( $RID ) );
	$sql = "INSERT INTO `formid` (`randomId` ) VALUES ('$RID' )";
	$mysqli->query($sql);
	return $RID;
}

function hasRandomFormId( $RID ) {
	global $mysqli;
	connect();
	$result = $mysqli->query("SELECT COUNT(*) AS c FROM formid WHERE randomId=$RID");
	$row = $result->fetch_assoc();
	return $row['c'] > 0;
}


function deleteRandomFormId( $RID ) {
	global $mysqli;
	connect();
 	$sql = "DELETE FROM `formid` WHERE randomId=$RID";
	return $mysqli->query($sql);
}

function showParameter() {
	echo '<ol>';
	foreach($_REQUEST as $key => $value) {
		echo '<li>Parameterschl&uuml;ssel: <span style="color: blue">' . $key . '</span>,' ;
		echo 'Parameterwert: <span style="color: blue">' .$value . '</span></li>';
	}
	echo '<ol>';
}

function getGalleryImages( ) {
	global $mysqli;
	connect();
	return $mysqli->query("SELECT * FROM gallery" );
}

function addGalerieImage( $file, $text ) {
	global $mysqli;
	connect();
        $sql = "INSERT INTO gallery ( `image`, `text`) VALUES ( '$file', '$text' )";
	return $mysqli->query($sql);
}


?>
