# Assignment 2 - Backend API Integration & Service Development

This project demonstrates backend-to-backend API communication using Node.js and Express. It integrates the **OpenWeatherMap API** for weather data and the **ExchangeRate-API** for currency conversion.

## Features

### 1. Weather Dashboard (Core Requirement)
- Fetches real-time weather data from OpenWeatherMap (Server-side).
- Displays: Temperature, Description, Feels-like, Wind Speed, Coordinates, Country Code, and Rain Volume (last 3h).
- **Endpoint**: `GET /weather?city={cityName}`

### 2. Currency Converter (Additional API)
- Fetches real-time exchange rates (Server-side).
- Converts between USD, EUR, GBP, KZT, and RUB.
- **Endpoint**: `GET /currency?from={ABC}&to={XYZ}&amount={100}`

### 3. The Cat API (Additional API)
- Fetches random cat images (Server-side).
- **Endpoint**: `GET /cat`

### 4. Responsive Frontend
- Built with HTML, CSS (clean/premium style), and Vanilla JS.
- Fully responsive design for mobile and desktop.

## Setup Instructions

1.  **Navigate to the folder**:
    ```bash
    cd assignment_2
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Create a `.env` file in the `assignment_2` root:
    ```env
    PORT=3000
    OPENWEATHER_API_KEY=your_openweather_api_key
    SECOND_API_KEY=your_currency_api_key_if_needed
    ```
    *(Note: The implemented Currency API is open and technically doesn't require a key for basic usage, but it's good practice to have one).*

4.  **Run the Server**:
    ```bash
    node server.js
    ```

5.  **Access the App**:
    Open [http://localhost:3000](http://localhost:3000)

## Design Decisions

- **Server-Side Fetching**: All API calls are made from `server.js` using `axios` to keep API keys secure and follow the assignment architecture.
- **Architecture**: Separated frontend (`public/`) from backend logic.
- **Styling**: Used CSS variables for consistent theming and Flexbox/Grid for layout.

## API Usage Details

### Weather API
Request:
`GET http://localhost:3000/weather?city=London`
Response:
```json
{
  "temperature": 15.5,
  "description": "broken clouds",
  "coordinates": { "lon": -0.12, "lat": 51.51 },
  "feels_like": 14.8,
  "wind_speed": 4.1,
  "country": "GB",
  "rain_3h": 0
}
```

### Currency API
Request:
`GET http://localhost:3000/currency?from=USD&to=EUR&amount=100`
Response:
```json
{
  "base": "USD",
  "target": "EUR",
  "rate": 0.92,
  "convertedAmount": 92.00
}
```
