# Lifespan Estimator — CSS-449-1

Project metadata

- Name: Steven
- NetID: srosas
- GitHub repository: https://github.com/DevGhosty/CSS-449-1  (update if different)
- Deployed site: (optional) — add URL here if deployed

Idea

This is a small client-side web app that presents a lifestyle and environment survey and returns a simple, educational estimate of life expectancy. The estimate is produced by a transparent, rule-based model that starts from a baseline life expectancy and applies explainable year adjustments for lifestyle, health, socioeconomic, and environmental factors.

Files added

- `index.html` — the survey UI
- `styles.css` — page styling and animated background
- `script.js` — form handling, unit conversions (Metric/Imperial), estimator logic, and blob animation

How it works

- The app uses a simple rule-based model (not medical advice). It applies positive/negative year adjustments for BMI, smoking, alcohol, exercise, diet, sleep, stress, family history, chronic conditions, education, income, living area, occupation risk, social connections, sedentary hours, and medical check-ups.
- Unit systems: the UI supports Metric (cm/kg) and Imperial (ft/in, lb). Imperial inputs are converted client-side to metric for calculations.

Run locally

1. Open `index.html` in your browser (double-click or use "Open File" in your browser).
2. Choose Metric or Imperial at the top of the form, fill the fields (for Imperial use feet + inches and pounds), and press "Estimate my lifespan".

Notes and next steps

- This is a client-side static site — no server required.
- Suggested improvements: stricter form validation per unit system, show converted metric values when users input Imperial units, add accessibility attributes, add unit tests for calculation logic, or deploy to GitHub Pages and paste the URL above.

License & disclaimer

This project is for demonstration and educational purposes only and not a replacement for professional medical advice.
