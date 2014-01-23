/**
 * The girl needs words to show her care
 */

 var TipGenerator = (function(){
    var weatherTips = {
        "01d": "Great, sunny day! But don't forget sunscreen.",
        "01n": "Clear night, nice for a walk with a friend.",
        "02d": "Few clouds, might be good to do some outdoor activities.",
        "02n": "Can't see the moon. But always better than raining.",
        "03d": 'Nice clouds floating.',
        "03n": 'Nice clouds floating.',
        "04d": "Clouds are getting thicker, be prepared for bad weather.",
        "04n": "Clouds are getting thicker, be prepared for bad weather.",
        "09d": "Showering rain, better stay inside.",
        "09n": "Showering rain, better stay inside.",
        "10d": "Better not let the rain ruin your favorite shoes",
        "10n": "Better not let the rain ruin your favorite shoes",
        "11d": "Thunderstorm! Stay inside. Tell friends & family to be careful.",
        "11n": "Thunderstorm! Stay inside. Tell friends & family to be careful.",
        "13d": "Snowing, don't get too naughty.",
        "13n": "Snowing at night, watch out while walking, could be slippery.",
        "50d": "Fog, drive carefully.",
        "50n": "Fog, drive carefully."
    }

    function getWeatherTip(weather_icon){
        return weatherTips[weather_icon];
    }

    function getTempTip(c_degree){
        if(c_degree < 5){
            return "Pretty cold, dress warmly don't forget scarfs, gloves!";
        }
        else if(c_degree < 15){
            return "A bit cool, still take care."
        }
        else if(c_degree < 25){
            return "Very agreeable temperature, enjoy it!";
        }
        else if(c_degree < 35){
            return "A bit hot, feeling like ice cream?";
        }
        else{
            return "Stay in the air-conditioned room!";
        }
    }

    function getHumidityTip(humidity){
        if(humidity < 33){
            return "Very dry! Stay hydrated and watch out temperature change between night and day."
        }
        else if(humidity < 66){
            return "Just enough humidity. Enjoy!";
        }
        else{
            return "Careful that some food goes bad quickly.";
        }
    }

    return {
        getWeatherTip: getWeatherTip,
        getTempTip: getTempTip,
        getHumidityTip: getHumidityTip
    }
 }());


/**
 * Girl's prompts to add cities
 */
var PromptsForAdd = [
    {
        girl: 'Missing someone?',
        input: 'Where is she/he?'
    },
    {
        girl: 'Going somewhere?',
        input: 'Where are you going?'
    },
    {
        girl: 'Fancy cities?',
        input: 'Like where?'
    },
    {
        girl: 'Always wonder?',
        input: 'A place of wonder?'
    }
];
