<?php
$courseId = filter_var( $_REQUEST['id'], FILTER_SANITIZE_STRING);

$result = getCourseInfo( $courseId )['data']['getCourse'][0];
//$record = $result->fetch_assoc();
$record = $result;

echo "<h3>Anlage " .  $record['name'];
if (isLoggedInAsAdmin() ) {
	echo '<a href="index.php?inhalt=anlageEdit&id=' . $courseId .'" class="glyphicon glyphicon-edit" title="Bearbeiten"></a>';
}

echo "</h3>";

showLines( $courseId );

$result =  getCourseScores( $courseId );
if( mysqli_num_rows($result) == 0 ) {
	echo '<div class="clearfix"></div><div class="row">F&uuml;r diese Anlage sind noch keine Ergebnisse eingetragen.</div>';
	return;
}
?>


<table class="rec" border="2"> 
<thead>
<tr><th>Datum</th><th>SpielerIn</th><th>Punkte</th>
<?php
for( $i=1; $i<=18; $i++ ) {
	echo "<th>$i</th>";
}
?>
<th><span class="glyphicon glyphicon-wrench" title="Bearbeitung von Ergebnissen f&uuml;r angemeldete Benutzer" /></tr>
</thead>
<tbody>

<?php
$av = array_fill(0,18,0);
if( $result ) {
	while ($record = $result->fetch_assoc()){
		echo '<tr>';
    		echo '<td>' . $record['date'] . '</td>';
    		//echo '<td>' . $record['name'] . '</td>';
		echo '<td><a href="index.php?inhalt=anlageSpielerStatistik&cid=' . $courseId . '&uid=' . $record['userid'] 
			. '">' . $record['name'] . '</a></td>';
		$holes = getHoles( $record['roundid']  );
		$sum = 0;
                $strokes = "";
		$ind = 0;
                while ($hole = $holes->fetch_assoc()){
		    $sum += $hole['strokes'];
                    if( $hole['strokes'] == 0 ) {
                    	$strokes .= '<td>.</td> ';
		    } else {
                    	$strokes .= '<td>' . $hole['strokes'] . '</td> ';
		    }
                    $av[$ind++] += 1.* $hole['strokes'];
		}
    		echo '<td d style="text-align:center">' . $sum . '</td>';
    		echo $strokes . '<td>';
		if (isLoggedInAs( $record['userid'] ) ) {
			 echo '<a href="index.php?inhalt=rundeLoeschen&id='. $record['roundid'] .'" class="glyphicon glyphicon-trash confirmation rightMargin" title="L&ouml;schen">';
			 echo '<a href="index.php?inhalt=rundeBearbeiten&id='. $record['roundid'] .'" class="glyphicon glyphicon-edit" title="Bearbeiten">';
		}
		echo '</td>';
    		echo '</tr>';
  	}
} else {
	echo "Query gescheitert.<br/>\n";
}
echo '</tbody>';

echo averageFooter( $av,  mysqli_num_rows($result), 1 );
echo '</table>';
?>

