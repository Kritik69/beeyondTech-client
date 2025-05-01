Project Overview
This project is built using Material-UI for creating a clean and responsive user interface. Below is a detailed breakdown of the key features and technologies used in this project:

Features
1. Protected Pages
The application ensures that sensitive pages are protected.
For example, the Dashboard Page (used for delivery management) is restricted to authorized users only. Unauthorized users cannot access this page.
2. Axios Interceptor
An Axios Interceptor is implemented to automatically attach the authentication token to every request sent to the server.
This ensures secure communication between the frontend and backend without the need to manually include the token in every API call.
3. SWR for Data Fetching
The project uses SWR (Stale-While-Revalidate) for efficient data fetching.
SWR ensures that the application always displays the latest data by continuously fetching updates in the background.
4. Real-Time Updates with Socket.IO
Socket.IO is integrated to provide real-time updates for delivery statuses.
This feature ensures that users receive live updates without needing to refresh the page.
5. Global State Management with Zustand
The application uses Zustand for managing global state.
Zustand provides a lightweight and efficient way to handle shared state across components without the complexity of larger state management libraries.
Technologies Used
Material-UI: For building a modern and responsive user interface.
Axios: For making HTTP requests, with an interceptor for token management.
SWR: For efficient and continuous data fetching.
Socket.IO: For real-time communication and updates.
Zustand: For global state management.
Summary
This project is designed to provide a seamless user experience with a focus on security, real-time updates, and efficient data handling. By leveraging modern tools like Material-UI, SWR, and Socket.IO, the application ensures that users have access to the latest information in a secure and user-friendly environment.