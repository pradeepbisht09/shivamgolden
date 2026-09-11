# Shivam Golden Transport Co. – Static Website Update

## What changed
- Removed the ERP dependency for service-area stations and branches.
- Stations and branches are now read from `data/site-data.json`.
- Tracking also reads from the same `data/site-data.json` file.
- Every Services box is clickable and opens the Contact section with the selected service pre-filled in the requirement field.
- Added `admin.html` to edit/load/download the JSON and optionally upload `data/site-data.json` directly to GitHub.

## GitHub JSON workflow
1. Keep `data/site-data.json` in the same GitHub repository as the website.
2. Edit the JSON using `admin.html`, or upload a prepared JSON file.
3. For direct GitHub upload, use a GitHub fine-grained token restricted to this repository with Contents: Read and write permission.
4. Enter the repository owner/name, branch and token in `admin.html`.
5. The token is used only in the browser for the upload request; do not commit it into any file.

## Important security note
Because this is a static website, a true server-side username/password admin system cannot be securely implemented with only HTML/CSS/JS. `admin.html` provides GitHub-authenticated publishing instead. For a fully private login/dashboard, add a backend (for example Node.js/Express or a managed authentication service).

## Local run
Open `index.html` using VS Code Live Server. Fetching `data/site-data.json` may be blocked when opening the HTML directly with `file://`, so Live Server is recommended.
