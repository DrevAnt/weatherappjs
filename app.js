"use strict";

const API_KEY = "83a9f9aeae857e946357d3aa39192ee8";

const timeElem = document.getElementById("time");
const dateElem = document.getElementById("date");
const currentWeatherItemsElem = document.getElementById(
  "current-weather-items"
);
const timeZone = document.getElementById("time-zone");
const country = document.getElementById("country");
const currentTemp = document.getElementById("current-temp");
const weatherForecastElem = document.getElementById("weather-forecast");

const daysArr = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthsArr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

setInterval(() => {
  const time = new Date();
  let date = time.getDate();
  let month = time.getMonth();
  let day = time.getDay();
  let hours = time.getHours();
  let amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutes = time.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;

  timeElem.innerHTML =
    (hours < 10 ? "0" + hours : hours) +
    ":" +
    minutes +
    " " +
    `<span id="am-pm">${amPm}</span>`;

  dateElem.innerHTML = daysArr[day] + ", " + date + " " + monthsArr[month];
}, 1000);

getWeatherData();
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        showWeatherData(data);
      });
  });
}

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timeZone.innerHTML = data.timezone;
  country.innerHTML = data.lat + "N " + data.lon + "E";

  function timeConverter(e) {
    let a = new Date(e * 1000);

    let hours = a.getHours();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let newFormat = hours >= 12 ? "pm" : "am";

    let min = a.getMinutes();
    min = min < 10 ? "0" + min : min;
    let sunTime = hours + ":" + min + " " + newFormat;

    return sunTime;
  }

  function dateConverter(e) {
    Date.prototype.getDayName = function () {
      return daysArr[this.getDay()];
    };

    let a = new Date(e);
    let dateFormated = a.getDayName();
    return dateFormated;
  }

  currentWeatherItemsElem.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div> ${timeConverter(sunrise)}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${timeConverter(sunset)}</div>
    </div>`;

  let someDayForecast = "";
  data.daily.forEach((day, index) => {
    if (index == 0) {
      currentTemp.innerHTML = `
      <img
          src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png"
          alt="weather icon"
          class="w-icon"
        />
        <div class="todayContainer">
          <div class="day">${dateConverter(day.dt * 1000)}</div>
          <div class="temp">Night - ${day.temp.night}&#176; C</div>
          <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>
      `;
    } else {
      someDayForecast += `
    <div class="weather-forecast-item">
          <div class="day">${dateConverter(day.dt * 1000)}</div>
          <img
            src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
            alt="weather icon"
            class="w-icon"
          />
          <div class="temp">Night - ${day.temp.night}&#176; C</div>
          <div class="temp">Day - ${day.temp.day}&#176; C</div>
        </div>`;
    }
  });
  weatherForecastElem.innerHTML = someDayForecast;
}
