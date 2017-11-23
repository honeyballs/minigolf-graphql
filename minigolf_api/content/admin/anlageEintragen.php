<div class="container-fluid">  

<h2>Anlage eintragen</h2>
<?php
$name   = filter_var( $_REQUEST['name'], FILTER_SANITIZE_STRING);
$info   = filter_var( $_REQUEST['info'], FILTER_SANITIZE_STRING);
$breite = filter_var( $_REQUEST['breite'], FILTER_SANITIZE_STRING);
$laenge = filter_var( $_REQUEST['laenge'], FILTER_SANITIZE_STRING);
$typ    = filter_var( $_REQUEST['typ'], FILTER_SANITIZE_STRING);
$formId = filter_var( $_REQUEST['formId'], FILTER_SANITIZE_STRING);

if( ! hasRandomFormId( $formId ) ) {
      include_once ("./content/error/invalid_form.php");
} else {
	deleteRandomFormId( $formId );
        $result = createCourse(  $name, $breite, $laenge, $typ, $info );
	if( $result['data']['createCourse'] ) {
            echo "Neue Anlage <em>$name</em> eingetragen<br>";
	} else {
            global $mysqli;
            echo "Fehler beim Eintragen" .  var_dump($result['error']) . "<br>";
	}
}

?>

</div>