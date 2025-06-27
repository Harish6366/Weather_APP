const apiKey = "443a6b427e705aa2aaf98592fec2e3e5";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const cityInput = document.getElementById("cityInput");
const cityList = document.getElementById("cityList");
const searchBtn = document.getElementById("searchBtn");
const weatherIcon = document.querySelector(".weather-icon");

// 🌍 GeoDB API for City Suggestions (Get an API Key: https://rapidapi.com/wirefreethought/api/geodb-cities/)
const geoApiUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=";
const geoApiKey = "your-rapidapi-key";  // ❗ Replace with your API Key

async function getCitySuggestions(query) {
    if (query.length < 2) return; // Only fetch after 2+ characters

    const response = await fetch(`${geoApiUrl}${query}&limit=5`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": geoApiKey,
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
        }
    });

    const data = await response.json();
    cityList.innerHTML = ""; // Clear previous options

    if (data.data) {
        data.data.forEach(city => {
            let option = document.createElement("option");
            option.value = city.city;
            cityList.appendChild(option);
        });
    }
}

// 🌎 Trigger city autocomplete on typing
cityInput.addEventListener("input", () => {
    getCitySuggestions(cityInput.value);
});

// 🌤 Fetch Weather Data
async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod === "404") {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "block";

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main === "Rain") {
            weatherIcon.src = "images/rain.png";
        } else if (data.weather[0].main === "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Mist") {
            weatherIcon.src = "images/mist.png";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// 🔍 Search Button Click
searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() === "") {
        alert("Please enter a city name!");
        return;
    }
    checkWeather(cityInput.value);
});
