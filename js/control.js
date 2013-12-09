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
		// input.keypress(function(e){
		// 	var keycode = (e.keyCode ? e.keyCode : e.which);
		// 	if(keycode == '13'){
		// 		searchCities(input.val());
		// 	}
		// });
        input.keyup(function(){
            suggestions.empty();
            WeatherManager.searchCities(input.val(), appendSuggestions);
        })

        add_button.click(function(){
            new_weather = {};
            search_page.slideDown(200);
        });

        add_done.click(function(){
            if(input.val() != undefined || input.val() != ''){
                city = input.val();
                WeatherManager.getForcast(city, function(data){
                    if(data != undefined){
                        saveForcast(data);
                    }
                    else{
                        prompt.text("Sorry! Can't find the place.");
                    }
                });
                WeatherManager.getCurrent(city, function(data){
                    if(data != undefined){
                        saveCurrent(data);
                        console.log(new_weather);
                        search_page.slideUp(200);
                        weathers.push(city);
                        current = weathers.length - 1;
                        prompt.text('Added successful!');
                    }
                    else{
                        prompt.text('Added successful!');
                    }
                });
            }
        });
	}

    function appendSuggestions(cities){
        for(i = 0; i < cities.length; i++){
            var city_name = cities[i].name
            $("<div class='item' data-city='"+city_name+"'>"+city_name+"</div>").appendTo(suggestions).click(function(event){
                city_name = $(event.target).data('city')
                input.val(city_name);
                suggestions.empty();
            });
        }
    }

    function saveForcast(data){
        new_weather.forcasts = [];
        for(i = 0; i < data.list.length; i++){
            item = data.list[i];
            new_weather.forcasts.push({
                degree: item.deg,
                weather_icon: item.weather[0].icon,
            });
        }
    }

    function saveCurrent(data){
        new_weather.name = data.name;
        new_weather.clouds = data.clouds;
        new_weather.wind_speed = data.wind.speed;
        new_weather.temp = data.main.temp;
        new_weather.temp_max = data.main.temp_max;
        new_weather.temp_min = data.main.temp_min;
        new_weather.humidity = data.main.humidity;
        new_weather.weather_icon = data.weather[0].icon;
    }

	return {
		init: function(){
			bindUIActions();
		}
	}
}());