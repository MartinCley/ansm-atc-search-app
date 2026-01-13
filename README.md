# ANSM ATC Codes Search App

A React application that allows users to search ATC (Anatomical Therapeutic Chemical) codes from the ANSM database via the Cleyrop API and display results in HTML format.

## Features

- **Search Interface**: Clean and intuitive search input for ATC codes (e.g., C01CE03)
- **Cleyrop API Integration**: Uses the Cleyrop Dataset API to fetch medical data
- **HTML Results Display**: Renders search results with HTML content safely
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling and loading states
- **TypeScript Support**: Full TypeScript implementation for type safety

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Access to the Cleyrop platform with a valid API token
- ANSM dataset available on your Cleyrop instance

## Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Before running the app, you need to configure the Cleyrop API:

1. **Get your API token**:
   - Go to your Cleyrop Profile & Token page
   - Generate a user token or project token

2. **Configure the API**:
   - Open `src/services/api.ts`
   - Update the constructor with your Cleyrop domain and token:
   ```typescript
   constructor(baseUrl: string = 'https://your-domain.cleyrop.com/data-serve/api/v1', token: string = 'your-token-here') {
     this.baseUrl = baseUrl;
     this.token = token;
   }
   ```

## Cleyrop API Integration

The app uses the Cleyrop Dataset API with the following endpoints:

### List Datasets
- **URL**: `/data-serve/api/v1/datasets`
- **Method**: GET
- **Authentication**: TOKEN header with your API token

### Get Dataset by ID
- **URL**: `/data-serve/api/v1/datasets/{datasetId}`
- **Method**: GET
- **Authentication**: TOKEN header with your API token

### Get Structured Dataset
- **URL**: `/data-serve/api/v1/datasets/structured/{datasetId}`
- **Method**: GET
- **Authentication**: TOKEN header with your API token

## Running the App

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Search for ATC codes (e.g., "C01CE03", "C01", "anticoagulants")

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── SearchInput.tsx      # Search input component
│   └── SearchResults.tsx    # Results display component
├── services/
│   └── api.ts              # Cleyrop API service layer
├── App.tsx                 # Main application component
├── App.css                 # Application styles
├── index.tsx               # Application entry point
└── index.css               # Global styles
```

## Customization

### Styling
- Modify `src/App.css` to customize the appearance
- The app uses CSS modules and responsive design

### API Integration
- Extend `src/services/api.ts` to add additional Cleyrop API methods
- Modify the `SearchResult` interface to match your dataset structure

### Features
- Add pagination, filtering, or sorting in the `SearchResults` component
- Implement advanced search features for medical codes

## Security Notes

- The app uses `dangerouslySetInnerHTML` to render HTML content from the API
- Ensure your Cleyrop datasets contain sanitized HTML content to prevent XSS attacks
- Keep your API token secure and don't expose it in client-side code in production

## Technologies Used

- React 18
- TypeScript
- CSS3 with Flexbox/Grid
- Fetch API for HTTP requests
- Cleyrop Dataset API

## ANSM & ATC Codes

This application is specifically designed for searching ATC codes from the ANSM (French National Agency for Medicines and Health Products Safety) database. ATC codes are used to classify drugs and other medical substances systematically.

Example ATC codes:
- `C01CE03`: Heparin group
- `C01`: Cardiac therapy
- `B01`: Antithrombotic agents

## License

This project is open source and available under the [MIT License](LICENSE).
