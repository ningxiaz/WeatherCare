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
        // if not mobile, make search page always cover the whole view point
        if(! detectmob()){
            $(window).resize(function(){
                search_page.css('height', window.innerHeight);
                start_page.css('height', window.innerHeight);
            });
        }

        start_add.click(function(){
            search_page.css('height', window.innerHeight);
            input.attr('placeholder', 'Where are you?');
            search_page.show();
            start_page.fadeOut(200);
            $('body').data('city_id', '');
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
            $('body').data('city_id', '');
            search_page.slideDown(200);
        });

        add_done.click(function(){
            city_id = $('body').data('city_id');

            if(city_id != undefined && city_id != ''){
                showCompleteWeatherById(city_id, function(){
                    search_page.slideUp(200);
                    places.push(city_id);
                    current = places.length - 1;
                    changePrompt();
                });
            }
            // if user just typed in a string, without choosing from the suggestions
            else{
                city = input.val();
                
                WeatherManager.searchCities(city, function(cities){
                    if(cities.length == 0){
                        prompt.text("Sorry! Can't find the place.");
                        search_page.slideUp(200);
                    }
                    // pick the first city, if there're any match
                    else{
                        city_id = cities[0].id;
                        showCompleteWeatherById(city_id, function(){
                            search_page.slideUp(200);
                            places.push(city_id);
                            current = places.length - 1;
                            changePrompt();
                        });
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
            var city_name = cities[i].name + ', ' + cities[i].sys.country;
            var city_id = cities[i].id;
            if(city_name != undefined && city_name != ''){
                $("<div class='item' data-city='"+city_name+"' data-id='"+city_id+"''>"+city_name+"</div>").appendTo(suggestions).click(function(event){
                    city_name = $(event.target).data('city');
                    input.val(city_name);
                    city_id = $(event.target).data('id');
                    $('body').data('city_id', city_id);
                    suggestions.empty();
                });
            }
        }
    }

    /**
     * show complete weather information by city ID, with optional callback
     */
    function showCompleteWeatherById(city_id, callback){
        WeatherManager.getCurrent(city_id, function(data){
            if(data != undefined){
                saveCurrent(data);
                showCurrent(new_weather);
                showTips(new_weather);
                if(callback && typeof(callback) === 'function'){
                    callback();
                }
            }
            else{
                prompt.text("Sorry! Please try again!");
            }
        });

        WeatherManager.getForcast(city_id, function(data){
            if(data != undefined){
                saveForcast(data);
                showForcast(new_weather);
            }
            else{
                prompt.text("Sorry! Please try again!");
            }
        });
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

    /**
     * Randomly change the prompts
     */
    function changePrompt(){
        random_prompt = PromptsForAdd[Math.floor(Math.random()*PromptsForAdd.length)];
        console.log(random_prompt);
        prompt.text(random_prompt.girl);
        input.attr('placeholder', random_prompt.input);
    }

	return {
		init: function(){
			bindUIActions();

            // fill the page to the full screen
            search_page.css('height', window.innerHeight);
            start_page.css('height', window.innerHeight);

            // init with Palo Alto as default
            showCompleteWeatherById('5380748');
		},
        changePrompt: changePrompt
	}
}());