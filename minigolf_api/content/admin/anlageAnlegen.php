
<div class="col-md-1"></div>
<div class="col-md-9">
   <form action="index.php" method="get" class="form-horizontal">
       <input type="hidden" name="inhalt" value="anlageEintragen">
       <input type="hidden" name="formId" value="<?= getRandomFormId()?>">

       <div class="form-group">
	   <label class="control-label col-sm-2" for="name">Name</label>
	   <div class="col-sm-6"> 
              <input type="text" name="name" id="name" class="form-control" required placeholder="Name der Anlage">
           </div>
       </div>

       <div class="form-group">
	   <label class="control-label col-sm-2" for="info">Infos</label>
	   <div class="col-sm-6"> 
              <input type="text" name="info" id="info" class="form-control" placeholder="zus&auml;tzliche Infos (optional)">
           </div>
       </div>

        <div class="form-group">
	   <label class="control-label col-sm-2" for="breite">Breitengrad</label>
	   <div class="col-sm-2"> 
              <input type="text" name="breite" id="breite" class="form-control" required>
           </div>
	   <label class="control-label col-sm-1" for="laenge">L&auml;ngengrad</label>
	   <div class="col-sm-2"> 
              <input type="text" name="laenge" id="laenge" class="form-control" required>
           </div>
       </div>

       <div class="form-group">
         <label class="control-label col-sm-2" for="type">Anlagen-Typ:</label>
	 <div class="col-sm-3"> 
         <select class="form-control" name="typ" id="type" required>
	<?php 
	$types = getCourseTypes()['data']['coursetypes'];
        foreach ($types as $type){
           echo '<option value="' . $type['id'] . '">' . $type['type'] . '</option>';
        }
        ?>
         </select>
       </div>
       </div>

       <button type="submit" class="btn btn-default">Eingaben absenden</button>
   </form>	
</div>
