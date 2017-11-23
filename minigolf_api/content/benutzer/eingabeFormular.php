<div class="row"> 
<div class="col-md-1"></div>
<div class="col-md-9">
	<form action="index.php" method="get" onSubmit="return checkRoundInput(this)" >

	<input type="hidden" name="inhalt" value="ergebnisEintragen">
	<input type="hidden" name="formId" value="<?= getRandomFormId()?>">

<div class="row"> 
<div class="col-md-3">
	<label for="userID" class="extra-margin">Name</label> 
<?php
$result = getFriends( $_SESSION["userid"] );

echo '<select name="userId" required>';
echo '<option value="">Bitte ausw&auml;hlen</option>';
while ($record = $result->fetch_assoc() ){
	echo $record['name'] .  "<br>";
	echo '<option value="'. $record['id'] . '" >';
	echo  htmlentities( $record['name'] ) . '</option>';
}
echo '</select>';
?>
</div>

<div class="col-md-3">
	<label for="courseInput" required class="extra-margin">Anlage</label> 
<?php
$result = getCourses()['data']['courses'];

echo '<select name="courseId" id="courseInput" required>';
echo '<option value="">Bitte ausw&auml;hlen</option>';
foreach ($result as $record){
	echo $record['name'] .  "<br>";
	echo '<option value="'. $record['id'] . '" >';
	echo  htmlentities( $record['name'] ) . '</option>';
}
echo '</select>';
?>
</div>

<div class="col-md-3">
	<label for="datum"  class="extra-margin">Datum</label> 
	<input type="date" name="datum"  id="datum" value="<?php echo date('Y-m-d'); ?>">
</div>

<div class="col-md-3">
	<label for="adventure"  class="extra-margin">Adventure</label> 
	<input type="checkbox" name="adventure" id="Adventure" onchange="changeForm()">
</div>
</div>

    <div id="inputTable">
    	<SCRIPT LANGUAGE="JAVASCRIPT" TYPE="TEXT/JAVASCRIPT">
    		var maxSchlaege = 7;
    		var anzahlBahnen = 9;

    		var res = generateForm( maxSchlaege, anzahlBahnen);
    		document.write( res  );
    	</SCRIPT>

       </div>
	<div class="alert alert-warning hide" id="eingabeFehler" > 
	<a class="close" onclick="$('.alert').addClass('hide')">&times;</a>
        <span></span>
	</div>
       <input type="hidden" name="inhalt" value="ergebnisEintragen">
       <button type="submit">Eingaben absenden</button>


    </form>
	
</div>
</div>