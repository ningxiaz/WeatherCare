var UIControls = (function(){
	var weathers = [];
    var new_weather = {};

	// index of the weathers array, which city user is viewing
	var current = 0; 

	// UI elements
	var input = $('#city-input');
	var header = $('header');
	var body = $('body');
    var add_button = $('.add');
    var suggestions = $('.suggestions');
    var add_done = $('#add-done');
    var search_page = $('.search-page');
    var prompt = $('.prompt');

	function bindUIActions(){
		input.keypress(function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode == '13'){
				searchCities(input.val());
			}
		});

        add_button.click(function(){
            new_weather = {};
            search_page.slideDown(200);
        });

        add_done.click(function(){
            search_page.slideUp(200);
            city = new_weather.name;
            if(city != undefined && city != ''){
                alert(city);
                weathers.push(city);
                current = weathers.length - 1;
                prompt.text('Added successful!');
            }
            else{
                prompt.text("Sorry! Can't find the place.");
            }
        });
	}

	function searchCities(city){
		console.log(city)
		$.getJSON("http://api.openweathermap.org/data/2.5/find?type=like&mode=json&q=" + city + "&callback=?", function(json) {
            if(json.cod == 200){
            	console.log(json);
            	cities = json.list;
                appendSuggestions(cities);
            }
        });
	}

    function appendSuggestions(cities){
        for(i = 0; i < cities.length; i++){
            var city_name = cities[i].name
            $("<div class='item'>"+city_name+"</div>").appendTo(suggestions).click(function(){
                suggestions.empty();
                input.val(city_name);
                searchCity(city_name);
            });
        }
    }

    function searchCity(city){
        forcast_url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=metric&cnt=5&q=";
        current_url = "http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q="
        $.getJSON(forcast_url + city + "&callback=?", function(json) {
            if(json.cod == 200){
                console.log(json);
                new_weather.forcasts = [];
                for(i = 0; i < json.list.length; i++){
                    item = json.list[i];
                    new_weather.forcasts.push({
                        degree: item.deg,
                        weather_icon: item.weather[0].icon,
                    });
                }
            }
            console.log('forcasts');
            console.log(new_weather);
            // show_forcast(new_weather);
        });
        $.getJSON(current_url + city + "&callback=?", function(json) {
            if(json.cod == 200){
                console.log(json);
                new_weather.name = json.name;
                new_weather.clouds = json.clouds;
                new_weather.wind_speed = json.wind.speed;
                new_weather.temp = json.main.temp;
                new_weather.temp_max = json.main.temp_max;
                new_weather.temp_min = json.main.temp_min;
                new_weather.humidity = json.main.humidity;
                new_weather.weather_icon = json.weather[0].icon;

                console.log('current');
                console.log(new_weather);
            }
        });
    }

	// function addWeather(weather){
	// 	console.log(weather);
	// 	weathers.push(weather);
	// }

	function switchView(weather_index, needUpdate){
		if(weather_index < 0 || weather_index >= weathers.length){
			return;
		}

		if(needUpdate){
			// TODO update the weather information
		}


	}

	return {
		init: function(){
			bindUIActions();
		}
	}
}());