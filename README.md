# Lifespan Estimator — CSS-449-1

This is a small static website (HTML/CSS/JS) that presents a lifestyle survey and produces a simple, educational estimate of life expectancy based on the answers.

Files added:

- `index.html` — the survey UI
- `styles.css` — page styling
- `script.js` — form handling and lifespan estimation logic

How it works

- The app uses a simple rule-based model (not medical advice). It starts from a base life expectancy by sex and applies positive/negative year adjustments for BMI, smoking, alcohol, exercise, diet, sleep, stress, family history, and chronic conditions.
- The model is intentionally simple for educational/demo purposes.

Run locally

1. Open `index.html` in your browser (double-click or use "Open File" in your browser).
2. Fill the form and press "Estimate my lifespan".

Notes and next steps

- This is a client-side static site — no server required.
- Improvements you might add: more sophisticated actuarial model, saving results, nicer visuals (charts), accessibility improvements, unit tests for calculation logic, server-side validation or user accounts.

License & disclaimer

This project is for demonstration and educational purposes only and not a replacement for professional medical advice.
