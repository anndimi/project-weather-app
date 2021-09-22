//DOMs
const changeCity = document.getElementById("changeCity");
const weatherContainer = document.getElementById("weather-container");
const todaysWeather = document.getElementById("today");
const dayContainer = document.getElementsByClassName("day-container");
const cityBtn = document.getElementById("cityBtn");
const backgroundImg = document.getElementById("backgroundImg");
const cityInput = document.getElementById("cityInput");


// Global variables
const timezoneOffset = new Date().getTimezoneOffset() * 60;

// The function creates an image for Javascript injection later into the HTML
const createWeatherImg = (url, alt) => {
    let weather = document.createElement("img");
    weather.src = url;
    weather.alt = alt;
    return weather;
};

// Creating images for different weather types
const cloudyIcon = createWeatherImg("./assets/cloud-icon.png", "clouds");
const rainIcon = createWeatherImg("./assets/rain-icon.png", "rain");
const sunIcon = createWeatherImg("./assets/sun-icon.png", "sun");
const windIcon = createWeatherImg("./assets/wind-icon.png", "wind");
const stormIcon = createWeatherImg("./assets/storm-icon.png", "storm");
const snowIcon = createWeatherImg("./assets/snow-icon.png", "snow");
const partlycloudyIcon = createWeatherImg(
    "./assets/partly-cloudy-icon.png",
    "partly cloudy"
);
const atmosphereIcon = createWeatherImg("./assets/atmosphere-icon.png", "atmosphere")
const fogIcon = createWeatherImg("./assets/fog-icon.png");

//Creating images for sunrise and sunset
const sunriseIcon = createWeatherImg("./assets/sunrise-icon.png", "sunrise");
const sunsetIcon = createWeatherImg("./assets/sunset-icon.png", "sunset");




function createFiveDayForecast(filteredForecast) {
    weatherContainer.innerHTML = ""
    for (let i = 0; i < 5; i++) {

        const daysWeatherIcon = chooseWeatherIcon(filteredForecast[i]);
        const days = new Date(filteredForecast[i].dt_txt).toLocaleDateString(
            "en-US",
            { weekday: "long" }
        );
        const forecastTemp = Math.round(filteredForecast[i].main.temp * 10) / 10;
        const forecastWeather = filteredForecast[i].weather.description;
        weatherContainer.innerHTML += createFiveDaysInnerHTML(days, forecastTemp, daysWeatherIcon);
    };
};

//Creates a weather icon based on the forecasted weather
function chooseWeatherIcon(forecast) {
    let main = forecast.weather[0].main;
    if (main === "Clouds") {
        return cloudyIcon;
    } else if (main === "Rain") {
        return  rainIcon;
    } else if (main === "Thunderstorm") {
        return  stormIcon;
    } else if (main === "Drizzle") {
        return  rainIcon;
    } else if (main === "Fog" || main === "Mist") {
        return  fogIcon;
    } else if (main === "Snow") {
        return  snowIcon;
    } else {
        return  sunIcon;
    }
};

//Creates innerHTML for each day in the forecast
function createFiveDaysInnerHTML(days, forecastTemp, daysWeatherIcon) {
     return `
        <section class="day"> 
        <span class="forcast-day">${days}</span> 
        <span class="forcast-temp">${forecastTemp} °C </span> 
        <span class="forcast-weather"><img src=${daysWeatherIcon.src} alt=${daysWeatherIcon.alt} class="forecast-weather"/></span>
        </section>
      
      `;
};

//Translates seconds into a date string
function getTimeOf(time, timezone) {
    return new Date(
        (time + timezone + timezoneOffset) * 1000
    ).toLocaleTimeString("sv-GB", { hour: "2-digit", minute: "2-digit" });
};

//Creates innerHTML to display todays weather and temperatures in the header
function getHeaderHTML(data, timeOfSunrise, timeOfSunset, weatherIcon) {
    return `
        <h1>${data.name}</h1>
        <h2>${Math.round(data.main.temp * 10) / 10} °C</h2>
        <h5>Feels like: ${Math.round(data.main.feels_like * 10) / 10} °C</h5>
        <img src=${weatherIcon.src} alt=${weatherIcon.alt} class= "today-weather"/>
        <h3>${data.weather.map((item) => item.description)}</h3>
        <h5 class="windpar"><img src=${windIcon.src} alt=${windIcon.alt} class= "wind-icon"/> ${Math.round(data.wind.speed * 10) / 10} m/s</h5>
        <p class="sunrisepar"><img src=${sunriseIcon.src} alt=${sunriseIcon.alt} class= "sunrise"/>Sunrise: ${timeOfSunrise}</p>
        <p class="sunsetpar"><img src=${sunsetIcon.src} alt=${sunsetIcon.alt} class= "sunset"/>Sunset: ${timeOfSunset}</p>
    `;
};

//Changes background image in header depending on todays weather prognosis
function getBackgroundWeatherClass(data) {
    let main = data.weather.map((item) => item.main);
    if (main.includes("Clouds")) {
        return "clouds";
    } else if (main.includes("Rain")) {
        return "rain";
    } else if (main.includes("Drizzle")) {
        return "drizzle";
    } else if (main.includes("Snow")) {
        return "snow";
    } else if (main.includes("Fog") || (main.includes("Mist"))) {
        return "fog";
    } else if (main.includes("Clear")) {
        return "clear";
    } else {
        return "atmosphere";
    }
};
//Eventlisteners
// DON"T DELETE, TO USE LATER!
cityBtn.addEventListener('click', (e) => {
    let city = cityInput.value
    console.log(city)
    let WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=5000cd66a9090b2b62f53ce8a59ebd9e`;

    let FIVE_DAYS = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=5000cd66a9090b2b62f53ce8a59ebd9e`;

    fetch(WEATHER_API)
        .then((res) => res.json())
        .then((data) => {
            backgroundImg.classList = getBackgroundWeatherClass(data);
            let timezone = data.timezone
            const timeOfSunrise = getTimeOf(data.sys.sunrise, timezone);
            const timeOfSunset = getTimeOf(data.sys.sunset, timezone)
            const weatherIcon = chooseWeatherIcon(data)
            today.innerHTML = getHeaderHTML(data, timeOfSunrise, timeOfSunset, weatherIcon);
        })
        .catch((error) => console.error("AAAAAAH!", error))
        .finally(() => console.log("YAY!"));

    fetch(FIVE_DAYS)
        .then((res) => res.json())
        .then((data) => {
            const filteredForecast = data.list.filter((item) =>
                item.dt_txt.includes("12:00")
            );
            createFiveDayForecast(filteredForecast);
        });

});

// cityBtn.addEventListener('click', (e) => {
//     console.log("button event", e)
//     console.log("bitton value", cityBtn.value)

// })
//     let FIVE_DAYS = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=5000cd66a9090b2b62f53ce8a59ebd9e`;
//     myFetch1()

// cityBtn.addEventListener('click', (WEATHER_API, FIVE_DAYS) => {
//     fetchFunction?????
// })backgroundImg.innerHTML += `
//<header id="backgroundSunny" class="background-sunny"></header>
//<section id="today" class="today"><h1>${data.name}</h1>
//<h2>${Math.round(data.main.temp * 10) / 10} °C</h2>
//<img src=${weatherImg.src} alt=${weatherImg.alt} class= "today-weather"/>
//<h3>${data.weather.map((item) => item.description)}</h3>
//<p class="sunrisepar"><img src=${sunriseIcon.src} alt=${sunriseIcon.alt} class= "sunrise"/>Sunrise: ${timeOfSunrise}</p>
//
//</section>
//`;
