/**
 * This javascript file handles the UI control logic of the app.
 */

var UIControls = (function(){
    // the places array contains all the names of the places added
	var places = [];
    var new_weather = {};

	// index of the weathers array, which city user is viewing
	var current = 0; 

	// UI elements
	var input = $('#city-input');
	var header = $('header');
	var body = $('body');
    var add_button = $('header .add'); // the add button in the header
    var suggestions = $('.suggestions');
    var add_done = $('#add-done');
    var search_page = $('.search-page');
    var prompt = $('header .prompt');
    var start_add = $('#add-current'); // the add button in the start page
    var cancel = $('.cancel');
    var start_page = $('.start-page');

    /**
     * binding events to the DOM objects
     */
	function bindUIActions(){
        // make search page always cover the whole view point
        $(window).resize(function(){
            search_page.css('height', window.innerHeight);
            start_page.css('height', window.innerHeight);
        });

        start_add.click(function(){
            search_page.css('height', window.innerHeight);
            input.attr('placeholder', 'Where are you?');
            search_page.show();
            start_page.fadeOut(200);
        });

        input.keyup(function(){
            suggestions.empty();
            if(input.val() != ''){
                WeatherManager.searchCities(input.val(), appendSuggestions);
            }
        });

        cancel.click(function(){
            search_page.slideUp(200);
        });

        add_button.click(function(){
            new_weather = {};
            input.val('');
            search_page.slideDown(200);
        });

        add_done.click(function(){
            if(input.val() != undefined || input.val() != ''){
                city = input.val();
                WeatherManager.getForcast(city, function(data){
                    if(data != undefined){
                        saveForcast(data);
                        showForcast(new_weather);
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
                        places.push(city);
                        current = places.length - 1;
                        prompt.text('Added successfully!');
                        showCurrent(new_weather);
                        showTips(new_weather);
                    }
                    else{
                        prompt.text('Added successfully!');
                    }
                });
            }
        });
	}

    /**
     * append suggestions to the search box given the lists of places
     */
    function appendSuggestions(cities){
        suggestions.empty();
        for(i = 0; i < cities.length; i++){
            var city_name = cities[i].name
            if(city_name != undefined && city_name != ''){
                $("<div class='item' data-city='"+city_name+"'>"+city_name+"</div>").appendTo(suggestions).click(function(event){
                    city_name = $(event.target).data('city')
                    input.val(city_name);
                    suggestions.empty();
                });
            }
        }
    }

    /**
     * save the forcast data returned from the API to a temporary object
     */
    function saveForcast(data){
        new_weather.forcasts = [];
        for(i = 0; i < data.list.length; i++){
            item = data.list[i];
            new_weather.forcasts.push({
                temp: item.temp.day,  // day temperature forcast
                weather_icon: item.weather[0].icon,
            });
        }
    }

    /**
     * save the current weather data returned from the API to a temporary object
     */
    function saveCurrent(data){
        new_weather.name = data.name;
        new_weather.clouds = data.clouds.all; // in percentage
        new_weather.wind_speed = data.wind.speed; // in mps
        new_weather.temp = data.main.temp; // in Celsius
        new_weather.humidity = data.main.humidity; // in percentage
        
        if(data.main.temp_max != undefined){
            new_weather.temp_max = data.main.temp_max;
        }
        if(data.main.temp_min != undefined){
            new_weather.temp_min = data.main.temp_min;
        }
        if(data.weather[0].icon != undefined){
            new_weather.weather_icon = data.weather[0].icon;
        }   
    }

    /**
     * display the current weather information
     */
    function showCurrent(weather){
        console.log(WeatherIcons[weather.weather_icon]);
        if(weather.weather_icon != undefined){
            $('.weather-icon i').removeClass().addClass(WeatherIcons[weather.weather_icon]);
        }
        $('h1.temp span').text(Math.round(CtoF(weather.temp)));
        $('span#humidity').text(weather.humidity);
        $('span#wind-speed').text(weather.wind_speed);
        $('span#clouds').text(weather.clouds);
        changeColorThemes(weather.weather_icon);
        $(".city").text(weather.name);
    }

    /**
     * display tips according to the weather
     */
    function showTips(weather){
        $('.weather-tip span').text(TipGenerator.getWeatherTip(weather.weather_icon));
        $('.temp-tip span').text(TipGenerator.getTempTip(weather.temp));
        $('.humidity-tip span').text(TipGenerator.getHumidityTip(weather.humidity));
    }

    /**
     * display the forcast
     */
    function showForcast(weather){
        for(i = 1; i < 5; i++){
            console.log('#day-'+i+' .day-of-week');
            console.log(weather.forcasts[i].weather_icon);
            $('#day-'+i+' .day-of-week').text(getDayXdaysAhead(i));
            $('#day-'+i+' .forcast-weather-icon i').removeClass().addClass(WeatherIcons[weather.forcasts[i].weather_icon]);
            $('#day-'+i+' .temp span').text(Math.round(CtoF(weather.forcasts[i].temp)));
        }
    }

    /**
     * Change color themes of the app based on the weather
     */
    function changeColorThemes(weather_icon){
        $(body).css('background-color', WeatherColors[weather_icon].major);

        prompt.css('background-color', WeatherColors[weather_icon].minor);
        // add_button.css('background-color', WeatherColors[weather_icon].minor);
        search_page.css('background-color', WeatherColors[weather_icon].minor);
        input.css('color', WeatherColors[weather_icon].minor);
        $('.suggestions .item').hover(function(){
            $(this).css('color', WeatherColors[weather_icon].minor);
        });
        $('.city').css('background-color', WeatherColors[weather_icon].minor);

        styleButton(add_button, WeatherColors[weather_icon].major);
        styleButton(add_done, WeatherColors[weather_icon].minor);
        styleButton(cancel, WeatherColors[weather_icon].minor)
    }

    /**
     * Define the color change rule of button behaviors
     */
    function styleButton(button, color){
        button.css('background-color', color);
        button.css('color', 'white');
        button.mouseenter(function() {
            $(this).css('background-color', 'white');
            $(this).css('color', color);
        }).mouseleave(function() {
            $(this).css('background-color', color);
            $(this).css('color', 'white');
        });
    }

	return {
		init: function(){
			bindUIActions();

            // fill the page to the full screen
            search_page.css('height', window.innerHeight);
            start_page.css('height', window.innerHeight);

            // init with Palo Alto as default
            city = 'Palo Alto'
            WeatherManager.getForcast(city, function(data){
                saveForcast(data);
                showForcast(new_weather);
            });

            WeatherManager.getCurrent(city, function(data){
                saveCurrent(data);
                places.push(city);
                current = places.length - 1;
                showCurrent(new_weather);
                showTips(new_weather);
            });
		}
	}
}());