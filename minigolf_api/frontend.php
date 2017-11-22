<?php 
function showLines( $courseId ) {
	$lines = getCourseLines( $courseId )['data']['getCourse'][0]['lines'];
	if( $lines &&  count($lines) > 0  ) {
		echo "<h4>Bahnen</h4>";
		echo '<div class="col-sm-9">';
		echo '<ol class="list-group row">';
		//while ($line = $lines->fetch_assoc()){
		foreach ($lines as $key => $line){
			echo '<li class="list-group-item col-sm-3">';
			//echo '<span class="badge badge-default badge-pill pull-left" style="margin-right:12px;">'. $line['index'] . '</span>';
			echo '<span class="badge badge-default badge-pill pull-left" style="margin-right:12px;">'. ($key+1) . '</span>';
			if( hasLineInfo(  $line['id'] ) ) {
				echo '<a href="index.php?inhalt=eternitBahn&typ=' . $line['name'] . '">' .  $line['name'] . '</a>';
			} else {
				echo $line['name'];
			}
			echo "</li>\n";
		}
		echo "</ol>";
		echo "</div>";
	}
}

function averageFooter( $av,  $n, $skip = 0 ) {
	$tav =  number_format ( array_sum($av) / $n , 1, ',', '.' );
	$avString = "<tfoot><tr>";
	for( $s=0; $s<$skip; $s++ ) {
		$avString .=  "<td></td>";
	}
	$avString .=  "<td><em>Mittelwert</em></td><td>$tav</td>";
	foreach( $av as $a ) {
		$avString .= '<td>' . number_format ( $a / $n, 1 ) . ' </td>';
	}
	$avString .= "<td></td></tr></tfoot>";
	return $avString;
}

?>