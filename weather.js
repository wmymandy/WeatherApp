var months = { "Jan": "January", 
               "Feb": "February", 
               "Mar": "March", 
               "Apr": "April", 
               "May": "May", 
               "Jun": "June", 
               "Jul": "July", 
               "Aug": "August", 
               "Sep": "September", 
               "Oct": "October", 
               "Nov": "November", 
               "Dec": "December" };
/* code that runs when Web page is first loaded and rendered by the browser */
var left = 0;
var showing = 4;

function getImage(weather) {
    var url = "";
    switch (weather) {
        case "Sunny":
        case "Mostly Sunny":
            url =  "../WeatherApp 3/sunny.png";
            break;
        case "Partly Sunny":
            url =  "../WeatherApp 3/part-sun.png";
            break;
        case "Cloudy":
        case "Partly Cloudy":
        case "Mostly Cloudy":
            url =  "../WeatherApp 3/cloudy.png";
            break;
        case "Snow":
            url = "../WeatherApp 3/snow.png";
            break;
        case "Wind":
        case "Breezy":
            url = "../WeatherApp 3/wind.png";
            break;
        case "Rain":
            url = "../WeatherApp 3/rain.png";
            break;
        case "Thunder":
        case "Thunderstorm":
            url =  "../WeatherApp 3/thunder.png";
            break;
        default: url = "ImgNotAvaiable";
    }
    return url;
}

/* called when new weather arrives */
function callbackFunction(data) {

    /* Error data */
    if (data.error) {
        alert(data.error.description);
        return;
    }

    /* Check if there is any data */
    if (data.query.results === null) {
        alert("Zip Code/City not found!");
        return;
    }

    left = 0;

    var pgh = document.getElementById("forecast");
    //pgh.textContent = JSON.stringify(data);
    //console.log(data);

    // remove old day
    var dayblocks = document.getElementsByClassName("dayblock");
    while (dayblocks[0] != null) {
        pgh.removeChild(dayblocks[0]);
    }

    var time = document.getElementById("time");
    var now = data.query.results.channel.lastBuildDate.split(' ');
    time.textContent = now[4] + now[5].toLowerCase();
	
    var place = document.getElementById("Place");
    place.textContent = data.query.results.channel.location.city + "," + data.query.results.channel.location.region;

    var date = document.getElementById("date");
    date.textContent = months[now[2]] + " " + now[1] + ", " + now[3];

    var todayImg = document.getElementById("statusPic");
    todayImg.src = getImage(data.query.results.channel.item.condition.text);

    var temp = document.getElementById("temp");
    temp.textContent = data.query.results.channel.item.condition.temp + "°";

    var status = document.getElementById("status");
    status.textContent = data.query.results.channel.item.condition.text;

    var humidity = document.getElementById("humidity");
    humidity.textContent = data.query.results.channel.atmosphere.humidity + "%";

    var wind = document.getElementById("wind");
    wind.textContent = data.query.results.channel.wind.speed + "mph";

    for (var i = 0; i < 10; i++) {
        var dayblock = document.createElement("div");
        dayblock.id = "day" + i;
        dayblock.className = "dayblock";

        var weekBlock = document.createElement("div");
        weekBlock.id = "week_of_day" + i;
        weekBlock.className = "day";
        weekBlock.textContent = data.query.results.channel.item.forecast[i].day;

        var imgOuterBlock = document.createElement("div");
        imgOuterBlock.id = "imgborder" +i;
        imgOuterBlock.className = "imgborder";

        var imgBlock = document.createElement("img");
        imgBlock.id = "image" + i;
        imgBlock.className = "image";
        imgBlock.src = getImage(data.query.results.channel.item.forecast[i].text);

        var statusBlock = document.createElement("div");
        statusBlock.id = "status" + i;
        statusBlock.className = "status";
        statusBlock.textContent = data.query.results.channel.item.forecast[i].text;
        
        var tempBlock = document.createElement("div");
        tempBlock.id = "temp" + i;
        tempBlock.className = "tempBlock";

        var highTempBlock = document.createElement("div");
        highTempBlock.id = "high_temp" + i;
        highTempBlock.className = "high_temp";
        highTempBlock.textContent = data.query.results.channel.item.forecast[i].high + "°";
        
        var lowTempBlock = document.createElement("div");
        lowTempBlock.id = "low_temp" + i;
        lowTempBlock.className = "low_temp";
        lowTempBlock.textContent = data.query.results.channel.item.forecast[i].low + "°";

        imgOuterBlock.appendChild(imgBlock);

        tempBlock.appendChild(highTempBlock);
        tempBlock.appendChild(lowTempBlock);

        dayblock.appendChild(weekBlock);
        dayblock.appendChild(imgOuterBlock);
        dayblock.appendChild(statusBlock);
        dayblock.appendChild(tempBlock);

        if (i > showing) {
            dayblock.style.display = "none";
        }

        pgh.appendChild(dayblock);
    }

    var backButton = document.getElementById("back");
    backButton.style.display = "none";

    var forwardButton = document.getElementById("forward");
    forwardButton.style.display = "";
}

window.onresize = resize;

function resize()
{
    var width = window.innerWidth;
    showing = 4;
    if (width <= 870) {
        showing--;

        if (width <= 700) {
            showing--;

            if (width <= 530) {
                showing--;
                if (width <= 480) {
                    left = 0;
                }
            }
        }
    }

    var disappear = 4 - showing;

    if (left > disappear) {
        left = left - disappear;
    }

    buttonAction(0);

}

resize();

/* called when button is pushed */
function getNewPlace() {
    // get what the user put into the textbox
    var newPlace = document.getElementById("zipbox").value;;
    searchNewPlace(newPlace);
}

function getNewPlaceMo() {
    // get what the user put into the textbox
    var newPlace = document.getElementById("zipboxMo").value;;
    searchNewPlace(newPlace);
}

function searchNewPlace(newPlace) {
    // make a new script element
    var script = document.createElement('script');

    // start making the complicated URL
    script.src = "https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='"+newPlace+"')&format=json&callback=callbackFunction"
    script.id = "jsonpCall";

    // remove old script
    var oldScript = document.getElementById("jsonpCall");
    if (oldScript != null) {
        document.body.removeChild(oldScript);
    }

    // put new script into DOM at bottom of body
    document.body.appendChild(script);
}

/* functions defined when Web page is loaded, but run when button is pushed. */
function buttonAction(direction) {

    var forecastBlock = document.getElementById("forecast");
    var dayblocks = document.getElementsByClassName("dayblock");

    var forecastWidth = forecastBlock.clientWidth;

    left += direction;

    if (-1 < left && left < dayblocks.length-showing) {
        for (var i = 0; i < dayblocks.length; i++) {
            var dayblock = dayblocks[i];
            var boxWidth = dayblock.clientWidth;

            if (i < left || i > left + showing) {
                dayblock.style.display = "none";
            }
            else {
                dayblock.style.display = "";
                dayblock.display = (left * boxWidth) + "px";
            }
        }
    }
    else {
        left -= direction;
    }

    var backButton = document.getElementById("back");
    if (left == 0) {
        backButton.style.display = "none";
    }
    else {
        backButton.style.display = "";
    }

    var forwardButton = document.getElementById("forward");
    if (left == dayblocks.length - showing - 1) {
        forwardButton.style.display = "none";
    }
    else {
        forwardButton.style.display = "";
    }
}




