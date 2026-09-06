# Shivam Golden Transport Co. Website

## Run in VS Code
1. Extract this folder.
2. Open the folder in VS Code.
3. Open `index.html`.
4. Use Live Server in VS Code for the best development experience, or double-click `index.html` to run it directly in Chrome.

## What is already working
- Responsive desktop/mobile layout
- Sticky navigation + mobile menu
- Smooth section navigation
- WhatsApp enquiry button
- Phone links
- Consignment tracking demo
- Contact enquiry form using the visitor's default email app
- Service-area section
- Hero design based on the supplied reference image

## Important for LIVE tracking
The tracking UI is ready, but real LR/GR status cannot be invented by a frontend page. For production, connect `script.js` to the SGT ERP/database/API so an LR number returns actual:
- current location
- shipment status
- dispatch date
- expected delivery
- POD status
- vehicle/driver information

Recommended production stack for the next phase:
Frontend: React/Next.js or this HTML/CSS/JS foundation
Backend: Node.js + Express
Database: PostgreSQL
Admin/ERP: role-based dashboard
Tracking API: `/api/track/:lrNumber`

Replace the demo tracking object in `script.js` with an API call once the ERP backend is available.
