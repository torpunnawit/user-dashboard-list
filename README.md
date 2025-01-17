# User dashboard table App

An application that allows users to log in using Google OAuth and export data to Google Sheets.

## Features

- Login using Google OAuth 2.0
- Search, sort, and display data in a responsive table
- Export data to Google Sheets

## Installation

1. Clone the repository:

2. Install dependencies:

3. Create a `.env` file in the root directory and configure the following variables:

4. Start the development server:

5. Run the backend server (in `server/`):

## Environment Variables

### `.env` (Frontend)

- `REACT_APP_GOOGLE_CLIENT_ID`: The client ID from your Google Cloud project
- `REACT_APP_API_URL`: The API endpoint for the backend server

### `config.env` (Backend)

- `GOOGLE_SERVICE_ACCOUNT`: Path to your Google service account JSON file
- `GOOGLE_SHEET_ID`: The ID of the Google Sheet where data will be exported
- `REACT_APP_API_URL`: url to use as api
- `PORT`: Porrt to use as api server

## File Structure

user-dashboard-app/
├── src/
│ ├── component/ # React components
│ ├── utils/ # Utility functions
│ ├── App.js # Main application file
│ ├── index.js # Entry point for the application
├── server/
│ ├── server.js # Backend server
│ ├── config.env # Environment variables for server
├── .env # Environment variables for frontend
├── README.md # Documentation
└── package.json # Project dependencies

## Usage

- Open the app in your browser at `http://localhost:3000`
- Log in using your Google account
- View and interact with the data table
- Export the data to Google Sheets
