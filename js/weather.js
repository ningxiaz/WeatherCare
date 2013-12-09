/**
*   This module connects with the API and get the weather data
*   from http://openweathermap.org/API
**/


var WeatherManager = (function(){

    function searchCities(query, callback){
        console.log(query)
        $.getJSON("http://api.openweathermap.org/data/2.5/find?type=like&mode=json&q=" + query + "&callback=?", function(json) {
            if(json.cod == 200){
                console.log(json);
                cities = json.list;
                if(callback && typeof(callback) === 'function'){
                    callback(cities);
                }
            }
        });
    }

    function getForcast(city, callback){
        forcast_url = "http://api.openweathermap.org/data/2.5/forecast/daily?mode=json&units=metric&cnt=5&q=";
        $.getJSON(forcast_url + city + "&callback=?", function(json){
            if(json.cod == 200){
                callback(json);
            }
            else{
                callback(undefined);
            }
        });
    }

    function getCurrent(city, callback){
        current_url = "http://api.openweathermap.org/data/2.5/weather?mode=json&units=metric&q=";
        $.getJSON(current_url + city + "&callback=?", function(json){
            if(json.cod == 200){
                callback(json);
            }
            else{
                callback(undefined);
            }
        });
    }


    return {
        searchCities: searchCities,
        getForcast: getForcast,
        getCurrent: getCurrent
    }
}());