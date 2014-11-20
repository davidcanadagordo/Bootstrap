var API_BASE_URL = "https://api.github.com";
var USERNAME = "?";
var PASSWORD = "?";

//autenticación
$.ajaxSetup({
    headers: { 'Authorization': "Basic "+ btoa(USERNAME+':'+PASSWORD) }
});


//1.Consultar Gist

$("#button_get").click(function(e) {
	e.preventDefault();
	getListGist();
});

function getListGist() {
	var url = API_BASE_URL + '/users/' + USERNAME + '/gists' ;
	$("#get_result").text('');
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var gists = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(link);
				$.each(gists, function(i, v) { 
				//for (var i=0; i<5; i++){
				
					
					var gist = v;

					$('<h4> Datos Gist </h4>').appendTo($('#get_result'));
					$('<p>').appendTo($('#get_result'));	
					$('<strong> ID: </strong> ' + gist.id + '<br>').appendTo($('#get_result'));
					$('<strong> URL: </strong> ' + gist.url + '<br>').appendTo($('#get_result'));
					$('<strong> Usuario: </strong> ' + gist.owner.login + '<br>').appendTo($('#get_result'));
					$('</p>').appendTo($('#get_result'));
					console.log(data);
				});
			

	}).fail(function() {
		$("#get_result").text("No Gists.");
	});

}


//2.Consultar Gist por id

$("#button_consultar").click(function(e) {
	
	e.preventDefault();
	if($('#gist_id').val() == ""){
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Debes proporcionar una ID </div>').appendTo($("#get_consultar"));
	}else{
	getGistid($("#gist_id").val());
	}
	
}); 

function getGistid(gist_id) {
	var url = API_BASE_URL + '/gists/' + gist_id;
	$("#get_consultar").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {

				var gist = data;

				$('<h4> Datos Gist </h4>').appendTo($('#get_consultar'));
				$('<p>').appendTo($('#get_consultar'));	
				$('<strong> ID: </strong> ' + gist.id + '<br>').appendTo($('#get_consultar'));
				$('<strong> URL: </strong> ' + gist.url + '<br>').appendTo($('#get_consultar'));
				$('<strong> Usuario: </strong> ' + gist.owner.login + '<br>').appendTo($('#get_consultar'));
				$('</p>').appendTo($('#get_consultar'));

			}).fail(function() {
				$('<div class="alert alert-danger"> <strong>Oh!</strong> Repository not found </div>').appendTo($("#get_consultar"));
	});

}


//3.Crear Gist

$("#button_crear").click(function(e) {
	e.preventDefault();

    var newGist;
	if($('#create_description').val() == "" || $('#create_files').val()==""){
		$('<div class="alert alert-info">Debes rellenar los campos descripcion y contenido</div>').appendTo($("#create_result"));
	}else{
		var filename = $('#archivo_to_create').val();
		newGist = {
			"description" : $('#create_description').val(),
			"public" : true,
			"files":{
				 "archivo1" :  {
					"content" : $('#create_files').val()
				}
			}
		}
		createGist(newGist);
	}

});

function createGist(newGist) {
	var url = API_BASE_URL + '/gists';
	var data = JSON.stringify(newGist);

	$("#create_result").text('');

	$.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		dataType : 'json',
		data : data,
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Gist Created</div>').appendTo($("#create_result"));	
        $("#create_description").val("");
		$("#create_files").val("");		
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#create_result"));
	});

	
	
}

//4. Borrar Gist
//4.1 button borrar
$("#button_borrar").click(function(e) {
	e.preventDefault();
	if($('#gist_borrar').val() == ""){
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Debes proporcionar una ID valida </div>').appendTo($("#get_borrar"));
	}else{
	delGist($("#gist_borrar").val());
	}
});
//4.2 Funcion borrar 
function delGist(gist_borrar){
	$("#get_borrar").text('');
	var url = API_BASE_URL + '/gists/' + gist_borrar;
	$.ajax({
		url: url,
		type : 'DELETE',
		crossDomain :true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Gist Eliminado</div>').appendTo($("#get_borrar"));				 
		console.log(data);
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> NO corresponde con ninguna ID </div>').appendTo($("#get_borrar"));
	});
}


//5.Editar Gist

//5.1Button edit + function
$("#button_edit").click(function(e) {
	e.preventDefault();
	if($('#id_edit_gist').val() == ""){
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Debes proporcionar una ID valida </div>').appendTo($("#edit_result"));
	}else{
	getGistToEdit($("#id_edit_gist").val());
	}
});

function getGistToEdit(id_edit_gist) {
	var url = API_BASE_URL + '/gists/' + id_edit_gist;
	$("#edit_result").text('');

	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
		
				var gist = data;
				//$("#edit_result").text('');
				$("#edit_description").val(gist.description);
				//$("#edit_content").val(content);
				

	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Gist not found </div>').appendTo($("#edit_result"));
	});

}

//5.2 button save + function

$("#button_save").click(function(e) {
	e.preventDefault();

    var editGist;
	if($('#edit_description').val() == "" || $('#edit_content').val()==""){
		$('<div class="alert alert-info">Debes rellenar los campos descripcion y contenido</div>').appendTo($("#edit_result"));
	}else{
	var id = $('#id_edit_gist').val()
	console.log(id)
	
	 editGist = {
	          "description" : $("#edit_description").val(),
	          "files" : {
	          "archivo1" : {
	                "content" : $("#edit_content").val()
	  }
	  }
	}
	updateGist(editGist, id);
	}
});

function updateGist(editGist, id) {
	var url = API_BASE_URL + '/gists/' + id;
	var data = JSON.stringify(editGist);

	$("#edit_result").text('');

	$.ajax({
		url : url,
		type : 'PATCH',
		crossDomain : true,
		dataType : 'json',
		data : data,
		statusCode: {
    		404: function() {$('<div class="alert alert-danger"> <strong>Oh!</strong> Page not found </div>').appendTo($("#edit_result"));}
    	}
	}).done(function(data, status, jqxhr) {
		$('<div class="alert alert-success"> <strong>Ok!</strong> Gist Updated</div>').appendTo($("#edit_result"));				
  	}).fail(function() {
		$('<div class="alert alert-danger"> <strong>Oh!</strong> Error </div>').appendTo($("#edit_result"));
	});

}

//Paginar consulta lista

$("#button_paginar").click(function(e) {
	
	e.preventDefault();
	if($('#gist_pagina').val() == "" || $('#gist_resultados').val()==""){
		$('<div class="alert alert-info">Debes rellenar los campos pagina y num de resultados</div>').appendTo($("#get_paginar"));
	}else if (isNaN($("#gist_pagina").val())){
		$('<div class="alert alert-info"> <strong>Oh!</strong> La pagina  deber ser un numero </div>').appendTo($("#get_paginar"));
	}else if (isNaN($("#gist_resultados").val())){
		$('<div class="alert alert-info"> <strong>Oh!</strong>  El resultado deber ser un numero </div>').appendTo($("#get_paginar"));
	}else{
	getPaginar($("#gist_pagina").val(),$("#gist_resultados").val());
	}
	
}); 

function getPaginar(gist_pagina,gist_resultados) {
	var url = API_BASE_URL + '/users/' + USERNAME + '/gists?page=' + gist_pagina + '&per_page=' + gist_resultados ;
	$("#get_paginar").text('');
	
	$.ajax({
		url : url,
		type : 'GET',
		crossDomain : true,
		dataType : 'json',
	}).done(function(data, status, jqxhr) {
				var gists = data;
				var link = jqxhr.getResponseHeader('Link');
				console.log(link);
				$.each(gists, function(i, v) { 
				
				
					
					var gist = v;

					$('<h4> Datos Gist </h4>').appendTo($('#get_result'));
					$('<p>').appendTo($('#get_result'));	
					$('<strong> ID: </strong> ' + gist.id + '<br>').appendTo($('#get_paginar'));
					$('<strong> URL: </strong> ' + gist.url + '<br>').appendTo($('#get_paginar'));
					$('<strong> Usuario: </strong> ' + gist.owner.login + '<br>').appendTo($('#get_paginar'));
					$('</p>').appendTo($('#get_paginar'));
					console.log(data);
				});
			

	}).fail(function() {
		$("#get_paginar").text("No hay resultados");
	});

}





