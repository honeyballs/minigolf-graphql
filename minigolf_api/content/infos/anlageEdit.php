
<?php
$log = "";

$courseId = filter_var($_REQUEST['id'], FILTER_SANITIZE_STRING);

$result = getCourseInfo($courseId);
$record = $result['data']['getCourse'][0];
echo '<h3>Anlage <a href="index.php?inhalt=anlageStatistik&id=' . $courseId . '">' . $record['name'] . "</a> bearbeiten</h3>";
echo "<h4>Bahnen</h4>";

foreach ($_REQUEST as $key => $value) {
    if (preg_match('/^b([1-9]+)$/', $key, $treffer)) {
        //echo $key . " " .  $value . " -> id:" . $treffer[1] . "<br>"; 
        $pos = (int) $treffer[1];
        $lineId = $value;
        setLine($courseId, $pos, $lineId);
        //debug(setLine($courseId, $pos, $lineId));
    }
    if ($key == "add") {
        $line = filter_var($_REQUEST['line'], FILTER_SANITIZE_STRING);
        addLineForCourse($courseId, $value, $line);
        //debug(addLineForCourse( $courseId, $value, $line ));
    }
    if ($key == "del") {
        $line = filter_var($value, FILTER_SANITIZE_STRING);
        deleteLineFromCourse($courseId, $line);
    }
}

$lines = getCourseLines($courseId)['data']['getCourse'][0]['lines'];
$allLines = getLines()['data']['lines'];

$pos = 0;

if ($lines && count($lines) > 0) {
    ?>
    <form class="form-horizontal" action="index.php" method="get">
        <input type="hidden" name="inhalt" value="anlageEdit">
        <?php
        echo '<input type="hidden" name="id" value="' . $courseId . '">';


        foreach ($lines as $pos => $line) {
            //When using nosql cl_id isn´t necessary
            $name = 'b' . ($pos += 1);
            echo '<div class="form-group">';
            echo '<label class="control-label col-sm-1" for="' . $name . '">Bahn ' . ($pos + 1) . ':</label>';
            echo '<div class="col-sm-4">';
            echo '<select class="form-control" name="' . $name . '">';
            foreach ($allLines as $type) {
                echo '<option value="' . $type['id'] . '"';
                if ($type['id'] == $line['id']) {
                    echo '  selected';
                }
                echo '>' . $type['name'] . '</option>';
            }
            echo '</select>';
            echo '</div>';
            echo '<a href="index.php?inhalt=anlageEdit&del=' . $line['id'] . "&id=$courseId"
            . '" class="glyphicon glyphicon-trash confirmation col-sm-1" title="L&ouml;schen"></a>';
            echo '</div>';
            //echo '<li><a href="index.php?inhalt=eternitBahn&typ=' . $line['name'] . '">' .  $line['name']  ."</li>";
        }
        ?>
        <button type="submit">Eingaben absenden</button>
    </form>
    <?php
}
?>



<div>
    <form class="form-vertical" action="index.php" method="get">
        <input type="hidden" name="inhalt" value="anlageEdit">
        <div class="form-group">
            <?php
            echo '<input type="hidden" name="id" value="' . $courseId . '">';
            echo '<label class="control-label col-sm-1" for="add">Bahn: ' . ($pos + 1) . '</label>';
            echo '<input type="hidden" name="add" min="1" max="18" value="' . ($pos + 1) . '" class="col-sm-1" required> ';
            echo '<div class="col-sm-4">';
            echo '<select class="form-control" name="line">';
            foreach ($allLines as $type) {
                echo '<option value="' . $type['id'] . '">' . $type['name'] . '</option>';
            }
            echo '</select>';
            echo '</div>';
            ?>
            <button type="submit">Bahn einf&uuml;gen</button>
        </div>
</div>
