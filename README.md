# Simple Portfolio (Job Application Ready)

This is a lightweight, responsive portfolio built with **plain HTML, CSS, and a tiny bit of JS**.

## Files
- `index.html` — main portfolio page
- `calculator.html` — client-side ingredient costing and profit calculator
- `calculator.js` — live batch costing calculations
- `styles.css` — styling
- `script.js` — small interactions (mobile menu + footer year)
- `README.md` — setup notes

## How to use
1. Open `index.html` in your browser.
2. Update placeholders:
   - Name: `index.html` (brand + hero)
   - Projects: replace titles/descriptions/tech bullets
   - Links: set real URLs for GitHub/Live Demo
   - Resume: update the `href` of the “Resume PDF” button
   - Contact email: update `mailto:you@example.com`
3. When you’re ready to publish, upload the folder to GitHub Pages / your host.

## Publish with GitHub Pages
This project is a static site and does not need a build step. To publish it at a shareable URL:

1. Create a **public** GitHub repository (for example, `ingredient-cost-calculator`). Leave it empty; do not add a README or `.gitignore`.
2. In PowerShell, run these commands from this project folder, replacing `YOUR_GITHUB_USERNAME` with your account name:

   ```powershell
   git init
   git branch -M main
   git add .
   git commit -m "Publish ingredient cost calculator"
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ingredient-cost-calculator.git
   git push -u origin main
   ```

3. In the repository on GitHub, open **Settings → Pages** and set the build source to **GitHub Actions**.
4. Wait for the **Deploy static site to GitHub Pages** workflow to finish. The public site URL will appear under **Settings → Pages** and in the workflow deployment.

The included `.github/workflows/pages.yml` automatically publishes the site whenever changes are pushed to `main`. Because GitHub Pages serves public content, the published site and its source code are visible to anyone.

## Notes
- The contact form is a **visual placeholder** (no backend). Connect it to a service like Formspree if you want working submissions.
