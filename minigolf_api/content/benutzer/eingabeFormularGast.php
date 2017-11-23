
<div class="row"> 
<div class="col-md-1"></div>
<div class="col-md-9">
    <form action="index.php" method="get" onSubmit="return checkRoundInputGast(this)" >

<div class="col-md-3">
	<label for="courseInput" required class="extra-margin">Anlage</label> 
<?php
$result = getCourses()['data']['courses'];

echo '<select name="courseId"  id="courseInput"  required>';
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
	<label for="datumInput"  class="extra-margin">Datum</label> 
	<input type="date" name="datum"  id="datumInput" value="<?php echo date('Y-m-d'); ?>">
</div>

<div class="col-md-3">
	<label for="adventure"  class="extra-margin">Adventure</label> 
	<input type="checkbox" name="adventure" id="adventure" onchange="changeForm()">
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
       <button type="button" onClick="saveToLocalFile()">Lokal speichern</button>


    </form>
	
</div>
</div>

<div class="row">
<div class="col-md-1"></div>
<div class="col-md-6">
G&auml;ste k&ouml;nnen hier Ergebnisse eingeben aber nur lokal speichern.
</div> 
</div>
