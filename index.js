   
// Weather App JavaScript
// Refactored for clarity, maintainability, and robustness

const apiKey = "445cf8ff843e4d3c45de22c8c70f5d76";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
let timeInterval; // for clearing timers

// Utility: Set weather icon based on condition
function setWeatherIcon(condition) {
    const iconMap = {
        "Clouds": "clouds.png",
        "Clear": "clear.png",
        "Rain": "rain.png",
        "Drizzle": "drizzle.png",
        "Mist": "mist.png"
    };
    weatherIcon.src = `images/${iconMap[condition] || "clear.png"}`;
}

// Utility: Show error message
function showError(message) {
    document.querySelector(".city").innerHTML = "Error";
    document.querySelector(".temp").innerHTML = "-";
    document.querySelector(".humidity").innerHTML = "-";
    document.querySelector(".wind").innerHTML = "-";
    document.querySelector(".time").innerHTML = message;
    document.querySelector(".weather").style.display = "block";
    weatherIcon.src = "images/mist.png";
}

// Main: Fetch and display weather
async function checkWeather(city) {
    if (!city) {
        showError("Please enter a city name.");
        return;
    }
    try {
        const response = await fetch(apiUrl + encodeURIComponent(city) + `&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();

        // Weather details
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        setWeatherIcon(data.weather[0].main);
        document.querySelector(".weather").style.display = "block";

        // === TIME CODE START ===
        if (timeInterval) clearInterval(timeInterval); // clear previous timer

        function updateTime() {
            const timezoneOffset = data.timezone; // in seconds
            const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
            const localTime = new Date(utcTime + timezoneOffset * 1000);
            const options = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const timeString = localTime.toLocaleTimeString('en-US', options);
            document.querySelector(".time").innerHTML = `Time: ${timeString}`;
        }

        updateTime(); // show immediately
        timeInterval = setInterval(updateTime, 1000); // update every second
        // === TIME CODE END ===
    } catch (err) {
        showError("City not found or API error.");
    }
}

// Search Button Event
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value.trim());
});

// Enter key event for input
searchBox.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkWeather(searchBox.value.trim());
    }
});

// Default city on load
window.addEventListener("DOMContentLoaded", () => {
    checkWeather("Pune");
});


