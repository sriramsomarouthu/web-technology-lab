document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeather');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const weatherResult = document.getElementById('weatherResult');
    const cityNameEl = document.getElementById('cityName');
    const temperatureEl = document.getElementById('temperature');
    const conditionEl = document.getElementById('condition');

    // Load cached city on page load
    loadCachedWeather();

    getWeatherBtn.addEventListener('click', fetchWeather);

    // Allow Enter key
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fetchWeather();
    });

    async function fetchWeather() {
        const city = cityInput.value.trim();
        if (!city) {
            showError('Please enter a city name.');
            return;
        }

        showLoading();

        try {
            // First, get city lat/lon (using free Nominatim)
            const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`;
            const geoResponse = await fetch(geoUrl);
            if (!geoResponse.ok) throw new Error('City not found.');
            const geoData = await geoResponse.json();
            if (geoData.length === 0) throw new Error('City not found.');

            const { lat, lon } = geoData[0];

            // Fetch weather from Open-Meteo
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto&forecast_days=1`;
            const weatherResponse = await fetch(weatherUrl);
            if (!weatherResponse.ok) throw new Error('Weather data unavailable.');
            const weatherData = await weatherResponse.json();

            const current = weatherData.current;
            const temp = current.temperature_2m;
            const code = current.weather_code;

            // Map weather code to description (WMO codes)
            const conditions = {
                0: 'Clear sky',
                1: 'Mainly clear',
                2: 'Partly cloudy',
                3: 'Overcast',
                45: 'Fog',
                48: 'Depositing rime fog',
                51: 'Light drizzle',
                53: 'Moderate drizzle',
                55: 'Dense drizzle',
                61: 'Slight rain',
                63: 'Moderate rain',
                65: 'Heavy rain',
                71: 'Slight snow',
                73: 'Moderate snow',
                75: 'Heavy snow',
                80: 'Slight rain showers',
                81: 'Moderate rain showers',
                82: 'Violent rain showers',
                85: 'Slight snow showers',
                86: 'Heavy snow showers',
                95: 'Thunderstorm',
                96: 'Thunderstorm with slight hail',
                99: 'Thunderstorm with heavy hail'
            };
            const condition = conditions[code] || 'Unknown';

            // Update UI
            cityNameEl.textContent = city;
            temperatureEl.textContent = `${temp}°C`;
            conditionEl.textContent = condition;
            weatherResult.classList.remove('hidden');

            // Cache result
            localStorage.setItem('cachedCity', city);
            localStorage.setItem('cachedWeather', JSON.stringify({ temp, condition }));

        } catch (err) {
            showError(err.message || 'Network error. Please try again.');
        } finally {
            hideLoading();
        }
    }

    function loadCachedWeather() {
        const cachedCity = localStorage.getItem('cachedCity');
        const cachedWeather = localStorage.getItem('cachedWeather');
        if (cachedCity && cachedWeather) {
            const { temp, condition } = JSON.parse(cachedWeather);
            cityInput.value = cachedCity;
            cityNameEl.textContent = cachedCity;
            temperatureEl.textContent = `${temp}°C`;
            conditionEl.textContent = condition;
            weatherResult.classList.remove('hidden');
        }
    }

    function showLoading() {
        loading.classList.remove('hidden');
        error.classList.add('hidden');
        weatherResult.classList.add('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(msg) {
        error.textContent = msg;
        error.classList.remove('hidden');
        weatherResult.classList.add('hidden');
    }
});