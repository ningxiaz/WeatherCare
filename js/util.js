/**
 * Utility functions
 */


/**
* Helper function to convert Celcius to Fahrenheit
*/
function CtoF(c_degree){
 return (c_degree * 9.0 / 5 + 32.0);
}

/**
* Helper function to convert Fahrenheit to Celcius
*/
function FtoC(f_degree){
 return ((f_degree - 32.0) * 5 / 9);
}

/**
* Helper function to get day of the week of x days ahead
* e.g. if today's Tuesday, 1 day ahead should be Wednesday 
* (the function will return 'Wed')
*/
function getDayXdaysAhead(x){
    xdaysahead = new Date();
    today = new Date();
    xdaysahead.setDate(today.getDate() + x);
    return getNameofDay(xdaysahead.getDay());
}

function getNameofDay(i){
    switch(i){
        case 0: return 'Sun';
        case 1: return 'Mon';
        case 2: return 'Tue';
        case 3: return 'Wed';
        case 4: return 'Thu';
        case 5: return 'Fri';
        case 6: return 'Sat';
    }
}