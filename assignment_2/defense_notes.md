# Project Defense Notes

## Core Concepts
- **Backend-to-Backend Communication**: The frontend never calls OpenWeatherMap directly. It calls *our* server (`/weather`), which then calls OpenWeatherMap. This hides the API key and allows us to process data before sending it to the client.
- **Asynchronous JavaScript**: usage of `async/await` and `axios` to handle network requests without blocking the main thread.
- **REST API Design**: We created `GET` endpoints that accept query parameters (e.g., `?city=London`).

## Code Structure
- `server.js`: The entry point. Initializes Express, configures middleware (CORS, JSON), and defines routes.
- `public/`: Static files served by `express.static`. Separates view (HTML/CSS) from logic (Node.js).

## Key Implementation Details
- **Rain Volume**: Handled conditionally (`data.rain ? data.rain['3h'] : 0`) because the API omits this field if there is no rain.
- **Environment Variables**: API keys are stored in `.env` and loaded via `dotenv` to prevent committing secrets to version control.

## Potential Questions & Answers
**Q: Why do we need `cors`?**
A: To allow (or restrict) cross-origin requests. Since our frontend is served from the same origin as the API in this specific setup, it's strictly not needed *locally*, but essential if the frontend were hosted separately (e.g., on Vercel) and the backend on Heroku.

**Q: How would you add a POST request?**
A: Use `app.post('/route', (req, res) => { ... })` and access data via `req.body`.

**Q: What happens if the implementation of the third API changes?**
A: Only the backend code (`server.js`) needs to update. The frontend interface (`/cat`) stays the same, preserving the contract with the client.
