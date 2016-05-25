//Usign JSXGraph
function graph_polinomial() {
	var board = JXG.JSXGraph.initBoard('box', 
		{ boundingbox: [-1.5,1.5,1,-1], 
		  axis:true,
		});

	var p = [];
	var num_nodes = $('#num_nodes').val();

	for (var i = 0; i < parseInt(num_nodes); i++) {
		var x = $('#nod_X' + i).val();
		var y = $('#nod_Y' + i).val();

		p[i] = board.create('point', [parseFloat(x), parseFloat(y)], {size:3});
	}

	var f = JXG.Math.Numerics.lagrangePolynomial(p);

	var graph = board.create('functiongraph', [f,-1.5,1.5], {strokeWidth: 3});
	var d1 = board.create('functiongraph', [JXG.Math.Numerics.D(f), -1.5, 1.5], {dash:1});
	var d2 = board.create('functiongraph', [JXG.Math.Numerics.D(JXG.Math.Numerics.D(f)), -1.5, 1.5], {dash:2});
	
}

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
console.log(csrftoken);

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

//Agregar Nodo
$('#add_node').on('click', function(event) {
			var prev_num = $("#num_nodes").val();
			var num_nodes = prev_num;

			$('#node_'+num_nodes).html("<td>"+ (num_nodes) + "</td><td><input id='nod_X"+num_nodes+"' type='text' placeholder='0.0' class='form-control input-md'/> </td><td><input  id='nod_Y"+num_nodes+"' type='text' placeholder='0.0'  class='form-control input-md'></td>");

			num_nodes = parseInt(num_nodes) + 1;

      		$('#tab_logic').append('<tr id="node_'+(num_nodes)+'"></tr>');
			
			$("#num_nodes").val(num_nodes);
});

//Borrar Nodo
$('#rem_node').on('click', function(event) {
	var num_nodes = $("#num_nodes").val();
	var new_node = parseInt(num_nodes);


	if (new_node > 0)
	{
		$('#node_' + (new_node - 1)).html('');
		$("#num_nodes").val(new_node - 1);
	}
});


//Ejecutar Calculo
$('#Compute').on('click', function(event) {
	var num_nodes = $('#num_nodes').val();
	var jsonObj = [];

	for (var i = 0; i < parseInt(num_nodes); i++) {
		var x = $('#nod_X' + i).val();
		var y = $('#nod_Y' + i).val();

		item = {};
		item["X"] = x;
		item["Y"] = y;

		jsonObj.push(item);
	}

	var obj = JSON.stringify(jsonObj);

	$.ajax({
		url: 'http://192.168.43.19:8000/Compute_Polinomial/',
		type: 'POST',
		dataType: 'json',
		data: obj,
	})
	.done(function(data) {
		$('#equ_result').text("$$ " + data.result + " $$");
		$('#step-step').html('');
		$('#step-step_1').html('');

		$.each(data.basePol, function(index, val) {
			
			 $.each(val, function(index1, val1) {
			 	 if ($.isArray(val1)) {
			 	 	var math_div = document.createElement('div');
			 	 	math_div.id = "math_step_" + index;

			 	 	var equation = "";

			 	 	for (i = 0; i < val1.length; i++){
			 	 		equation += val1[i] + " . ";
			 	 	}

			 	 	math_div.textContent = "$$ L("+ index + ") = " + equation.slice(0, - 1) +  " $$";
			 	 	$('#step-step').append(math_div);

			 	 	var math_ax = document.getElementById("math_step_" + index);
			 	 	MathJax.Hub.Queue(["Typeset",MathJax.Hub,math_ax]);

			 	 }
			 });
		});

		console.log(data.sumProduct);

		$.each(data.sumProduct, function(index, val) {
			 	 	var math_div = document.createElement('div');
			 	 	math_div.id = "math_sum_step_" + index;

			 	 	var equation = "";

			 	 	equation += val[1] + " * " + val[2];
 
			 	 	math_div.textContent = "$$ L("+ index + ") = " + equation +  " $$";
			 	 	$('#step-step_1').append(math_div);

			 	 	var math_ax = document.getElementById("math_sum_step_" + index);
			 	 	MathJax.Hub.Queue(["Typeset",MathJax.Hub,math_ax]);
		});

		var math = document.getElementById("equ_result");
		MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);

		//Graph Lagrange
		graph_polinomial();

		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	
	return false;
});

