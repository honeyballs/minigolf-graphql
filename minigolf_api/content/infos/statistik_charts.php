<script src="Chart.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js"></script>

<div class="container-fluid">  

<h2>Statistik</h2>
<h3>Runden</h3>

<?php
$log = "";

$mysqli = connect();

$sql = "SELECT date,users.name,courses.name AS cname,rounds.id AS roundid, course_id AS courseid FROM rounds JOIN users ON user_id=users.id JOIN courses ON course_id=courses.id ORDER BY date DESC";
$log .= $sql . '<br>';

$result = $mysqli->query($sql);

if( $result ) {
	while ($record = $result->fetch_assoc()){
		
                $sql_h =  "SELECT * FROM holes WHERE round_id=" . $record['roundid'] . ' ORDER BY hole ASC';
		$log .= $sql_h . '<br>';
                $holes =  $mysqli->query($sql_h);
		$sum = 0;
                $strokes = "";
    while ($hole = $holes->fetch_assoc()){
		    $sum += $hole['strokes'];
                    $strokes .= $hole['strokes'] . ' ';
		}
    		
    if( $record['courseid'] == 1 )
		{
			$label[] = $record['date'];
			$data[] = $sum;
		}
    			
    		
  	}
} else {
	echo "Query gescheitert.<br/>\n";
}

?>
<ul class="nav nav-tabs">
	<li class="dropdown active">
    <a class="dropdown-toggle" data-toggle="dropdown" href="#">Anlagen
    <span class="caret"></span></a>
    <ul class="dropdown-menu" id="selAnlage">
			<?php
			$result = getCourses()['data']['courses'];
			if( $result ) {
				foreach ($result as $course) {
					echo '<li><a data-toggle="tab" onclick="showStuff('. $course['id'] .')" href="#" id="'. $course['id'] .'">' . $course['name'] . '</a></li>';
				}
			} else {
					echo "Query gescheitert.<br/>\n";
				}
			?>
    </ul>
  </li>
	<li style="visibility:visible"><a data-toggle="tab" href="#anlage">&#8709; Anlage</a></li>
	<li style="visibility:visible"><a data-toggle="tab" href="#bahn">&#8709; Bahnen</a></li>
</ul>

<div class="tab-content">
	
	<div class="tab-pane fade in active" id="selectAnlage">
		<br>
		<div class="alert alert-info">
		<strong>Info!</strong> Bitte Anlage wählen!
		</div>
		
	</div>
	
	<div class="tab-pane fade" id="bahn">
		<div class="canvas-holder">
        <canvas id="chart-area"></canvas>
		</div>
    <script>
    var randomScalingFactor = function() {
        return Math.round(Math.random() * 100);
    };
    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };
    var randomColor = function(opacity) {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };

    var config = {
        data: {
            datasets: [{
                data: [
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                    randomScalingFactor(),
                ],
                backgroundColor: [
                    "#F7464A",
                    "#46BFBD",
                    "#FDB45C",
                    "#949FB1",
                    "#4D5360",
                ],
                label: 'My dataset' // for legend
            }],
            labels: [
                "Red",
                "Green",
                "Yellow",
                "Grey",
                "Dark Grey"
            ]
        },
        options: {
            responsive: true,
						maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Polar Area Chart'
            },
            scale: {
              ticks: {
                beginAtZero: true
              },
              reverse: false
            },
            animation: {
                animateRotate: false,
                animateScale: true
            }
        }
    };

    window.onload = function() {
        var ctx = document.getElementById("chart-area");
        window.myPolarArea = Chart.PolarArea(ctx, config);
    };

    $('#randomizeData').click(function() {
        $.each(config.data.datasets, function(i, piece) {
            $.each(piece.data, function(j, value) {
                config.data.datasets[i].data[j] = randomScalingFactor();
                config.data.datasets[i].backgroundColor[j] = randomColor();
            });
        });
        window.myPolarArea.update();
    });

    $('#addData').click(function() {
        if (config.data.datasets.length > 0) {
            config.data.labels.push('dataset #' + config.data.labels.length);

            $.each(config.data.datasets, function(i, dataset) {
                dataset.backgroundColor.push(randomColor());
                dataset.data.push(randomScalingFactor());
            });

            window.myPolarArea.update();
        }
    });

    $('#removeData').click(function() {
        config.data.labels.pop(); // remove the label first

        $.each(config.data.datasets, function(i, dataset) {
            dataset.backgroundColor.pop();
            dataset.data.pop();
        });

        window.myPolarArea.update();
    });
    </script>
	</div>

	<div class="row tab-pane fade" id="anlage">
		<div class="canvas-holder">
        <canvas id="myChart"></canvas>
			</div>
				<script>
					var ctx = document.getElementById("myChart");
					var myChart = new Chart(ctx, {
					type: 'line',
					data: {
					labels: JSON.parse('<?php echo json_encode($label); ?>'),
					datasets: [{
					label: '# of Votes',
					data: JSON.parse('<?php echo json_encode($data); ?>'),
					backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
					}]
					},
					options: {
					scales: {
					yAxes: [{
					ticks: {
							beginAtZero:true
					}
					}]
					},
					responsive: true,
					maintainAspectRatio: false
					}
					});
				</script>
		</div>
</div>
</div>
