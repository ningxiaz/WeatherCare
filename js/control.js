var UIControls = (function(){
	var weathers = {}

	var input = $('#city-input')

	function bindUIActions(){
		input.keyup(function(){
			searchCity(input.val());
			console.log(input.val())
		})
	}

	function searchCity(city){
		search_url = "http://api.openweathermap.org/data/2.5/weather"
		$.ajax({
			url: search_url,
			type: "GET",
			dataType: "json",
			data: {q: city},
			success: function(data){
				json_data = JSON.parse(data);
				console.log(data);
			},
			error: function() {
        console.log('process error');
      }
		});
	}

	return {
		init: function(){
			bindUIActions();
		}
	}
}());