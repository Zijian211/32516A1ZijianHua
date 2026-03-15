# 32516 A1 By Zijian Hua 25219890 -- Zijian Electronic Devices E-Commerce Platform 

The due date of this assignment is 5 April, 2026 and I publised the final version on 16 March.

## Project Summary
I built a single-page e-commerce application that allows users to browse electronic devices, manage a persistent shopping cart, and place orders. This project demonstrates a full-stack workflow with user authentication, database operations, and a responsive, accessible UI.

## Technical Stack
- **Frontend**: React with React Router (html, css, js, jsx) for navigation, and Tailwind CSS for styling.
- **Backend**: Node.js (python) with Express for API development, and FastAPI for CRUD management.
- **Database**: MongoDB (MongoDB Atlas - Cloud).
- **Deployment**: Frontend on Vercel and Backend on Render.
- **Key Libraries**: `motor` (async MongoDB driver), `pydantic` (data validation).

## Feature List
*   **User Authentication**: Secure signup/login with password complexity validation.
*   **Shopping Cart**: Add/remove items, update quantities with instant UI feedback.
*   **Checkout & Orders**: Convert cart to an order, view complete order history with collapsible details.
*   **Search & Filter**: Real-time product filtering by name and category.
*   **Accessibility**: ARIA labels, keyboard navigation, and sufficient color contrast.
*   **Responsive Design**: Fully functional on mobile, tablet, and desktop screens.

## Main Folders Structure
*   ├── frontend
*   │   ├── public/ # --- Static Assets ---
*   │   ├── src/
*   |   |   ├── components/ # --- UI Building Blocks (ProductCard, CartDrawer, Modals, Orders etc.) ---
*   |   |   ├── hookc/ # --- Custom Logic (useAuth, useCart, useOrders) ---
*   |   |   ├── services/ #  --- API Interaction Layer (api.js) ---
*   |   |   ├── App.jsx # --- Main App Component With Routing ---
*   |   |   ├── Main.jsx Application entry point
*   |   |   └── Index.html # --- Main Page For My Website (SPA) ---
*   │   └── package.json 
*   ├── backend
*   │   ├── main.py # --- Core API And Database Routes (CRUD) ---
*   │   ├── seed.py # --- Database Seeding Script For 20 Products ---
*   │   ├── env. Environment variables for MongoDB API (not committed)
*   │   ├── requirements.txt # Python dependencies
*   │   └── package.json
*   ├── .gitignore # --- Privacy System Setups For GitHub ---
*   └── README.md

## Challenges Overcome
*   **State Synchronization**: The frontend React context and the backend MongoDB database both contain a "cart" state that needs to remain synchronised, so I had to employ `useEffect` hooks to ensure they stayed that way [via re-fetching the cart every time there was a successful API operation (add, edit, delete)].
*   **Seamless Authentication**: To tackle real-time users' interactions in the website, I need to implemented persistent login/register authentication by writing user information to `localStorage` and creating a custom `useAuth` hook that acts as a single point of reference for user state across my entire application. Also, the strict password validation rules (uppercase, special character) were built for secure and user-friendly experience with clear error messages.
*   **Responsive Design**: Ensuring the UI looked good and functioned well across all devices was a challenge, especially with complex components like the shopping cart drawer and order history. I used Tailwind's responsive utilities to adjust layouts and styles based on screen size.

## Live Demo & Links
*   **Live Demo**: [Zijian's E-Commerce Platform](https://32516-a1-zijian-hua.vercel.app/)
*   **Backend Database API** [FastAPI - Swagger UI](https://three2516a1zijianhua.onrender.com/docs) (May take 30-60s to wake up, but I set Uptime Robot to keep it almost 24/7 operation)
*   **GitHub Repository**: [Zijian's E-Commerce GitHub](https://github.com/Zijian211/32516A1ZijianHua)
