const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: "City name is required" });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        // Process and return only required fields
        const weatherData = {
            temperature: data.main.temp,
            description: data.weather[0].description,
            coordinates: data.coord,
            feels_like: data.main.feels_like,
            wind_speed: data.wind.speed,
            country: data.sys.country,
            rain_3h: (data.rain && data.rain['3h']) || 0 // Ensure it returns 0 if no 3h rain data
        };

        res.json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data. Please check the city name or API key." });
    }
});

app.get('/currency', async (req, res) => {
    const { from, to, amount } = req.query;


    if (!from || !to) {
        return res.status(400).json({ error: "Please provide 'from' and 'to' currency codes." });
    }

    try {
        // Using the open endpoint which usually doesn't require a key
        const url = `https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`;
        const response = await axios.get(url);
        const rates = response.data.rates;
        const rate = rates[to.toUpperCase()];

        if (!rate) {
            return res.status(400).json({ error: `Currency code ${to} not found.` });
        }

        const resultAmount = amount ? (parseFloat(amount) * rate).toFixed(2) : null;

        res.json({
            base: from.toUpperCase(),
            target: to.toUpperCase(),
            rate: rate,
            convertedAmount: resultAmount
        });

    } catch (error) {
        console.error("Error fetching currency data:", error.message);
        res.status(500).json({ error: "Failed to fetch currency data." });
    }
});

app.get('/cat', async (req, res) => {
    try {
        // The Cat API - Random Image
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        if (response.data && response.data.length > 0) {
            res.json({ imageUrl: response.data[0].url });
        } else {
            res.status(404).json({ error: "No cat found" });
        }
    } catch (error) {
        console.error("Error fetching cat data:", error.message);
        res.status(500).json({ error: "Failed to fetch cat data" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
