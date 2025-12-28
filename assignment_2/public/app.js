document.addEventListener('DOMContentLoaded', () => {
    // Weather Logic
    const weatherBtn = document.getElementById('getWeatherBtn');
    const cityInput = document.getElementById('cityInput');

    weatherBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchWeather();
    });

    // Currency Logic
    const convertBtn = document.getElementById('convertBtn');
    const amountInput = document.getElementById('amountInput');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    convertBtn.addEventListener('click', convertCurrency);

    // Cat Logic
    const catBtn = document.getElementById('getCatBtn');
    catBtn.addEventListener('click', fetchCat);

    async function fetchWeather() {
        const city = cityInput.value.trim();
        const resultDiv = document.getElementById('weatherResult');
        const errorDiv = document.getElementById('weatherError');

        if (!city) return;

        // Reset UI
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        weatherBtn.textContent = 'Loading...';
        weatherBtn.disabled = true;

        try {
            const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch weather');
            }

            // Update UI
            document.getElementById('displayTemp').textContent = Math.round(data.temperature) + '°C';
            document.getElementById('displayDesc').textContent = data.description;
            document.getElementById('displayFeels').textContent = Math.round(data.feels_like);
            document.getElementById('displayHumidity').parentElement.style.display = 'none'; // Hide humidity for now as server backend doesn't send it

            document.getElementById('displayWind').textContent = data.wind_speed;
            document.getElementById('displayRain').textContent = data.rain_3h || 0;
            document.getElementById('displayCoords').textContent = `{data.coordinates.lat.toFixed(2)}, {data.coordinates.lon.toFixed(2)`;
            document.getElementById('displayCountry').textContent = data.country;

            resultDiv.classList.remove('hidden');

        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
        } finally {
            weatherBtn.textContent = 'Get Weather';
            weatherBtn.disabled = false;
        }
    }

    async function convertCurrency() {
        const amount = parseFloat(amountInput.value);
        const from = fromCurrency.value;
        const to = toCurrency.value;
        const resultDiv = document.getElementById('currencyResult');
        const errorDiv = document.getElementById('currencyError');

        // Reset UI first
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');

        // Validation: empty amount
        if (!amountInput.value || isNaN(amount)) {
            errorDiv.textContent = 'Please enter a valid amount';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Validation: negative numbers
        if (amount < 0) {
            errorDiv.textContent = 'Amount cannot be negative. Please enter a positive number.';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Validation: same currency
        if (from === to) {
            // Show result with same values (1:1 conversion)
            document.getElementById('displayAmount').textContent = amount;
            document.getElementById('displayBase').textContent = from;
            document.getElementById('displayResult').textContent = amount.toFixed(2);
            document.getElementById('displayTarget').textContent = to;

            document.getElementById('displayRateBase').textContent = from;
            document.getElementById('displayRate').textContent = '1.00';
            document.getElementById('displayRateTarget').textContent = to;

            resultDiv.classList.remove('hidden');

            // Show informational message
            errorDiv.textContent = 'Same currency selected - no conversion needed.';
            errorDiv.classList.remove('hidden');
            errorDiv.style.color = '#f0ad4e'; // Warning color (amber)
            return;
        }

        // Reset error color for actual errors
        errorDiv.style.color = '';

        convertBtn.textContent = 'Converting...';
        convertBtn.disabled = true;

        try {
            const response = await fetch(`/currency?amount=${amount}&from=${from}&to=${to}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to convert currency');
            }

            // Update UI
            document.getElementById('displayAmount').textContent = amount;
            document.getElementById('displayBase').textContent = data.base;
            document.getElementById('displayResult').textContent = data.convertedAmount;
            document.getElementById('displayTarget').textContent = data.target;

            document.getElementById('displayRateBase').textContent = data.base;
            document.getElementById('displayRate').textContent = data.rate;
            document.getElementById('displayRateTarget').textContent = data.target;

            resultDiv.classList.remove('hidden');

        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
        } finally {
            convertBtn.textContent = 'Convert';
            convertBtn.disabled = false;
        }
    }

    async function fetchCat() {
        const resultDiv = document.getElementById('catResult');
        const errorDiv = document.getElementById('catError');
        const img = document.getElementById('catImage');
        const btn = document.getElementById('getCatBtn');

        // Reset UI
        resultDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        btn.textContent = 'Meow...';
        btn.disabled = true;

        try {
            const response = await fetch('/cat');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch cat');
            }

            img.src = data.imageUrl;
            img.onload = () => {
                resultDiv.classList.remove('hidden');
                btn.textContent = 'Get Random Cat';
                btn.disabled = false;
            };

        } catch (err) {
            errorDiv.textContent = err.message;
            errorDiv.classList.remove('hidden');
            btn.textContent = 'Get Random Cat';
            btn.disabled = false;
        }
    }
});

