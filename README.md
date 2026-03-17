# Employee Insights Dashboard

A high-performance React application built for the engineering depth evaluation.

## 🚀 Features

- **Custom Virtualization**: A raw implementation of a virtualized grid to handle large datasets (60px row height, 5-row buffer).
- **Native Hardware Integration**: Accesses the browser's Camera API for identity verification.
- **Dynamic Signature Overlay**: Uses HTML5 Canvas to allow users to sign directly over their captured photo.
- **Image Merging**: Programmatically merges two canvas layers (photo + signature) into a single PNG Blob/Base64.
- **Raw SVG Data Viz**: Salary distribution charts built using raw SVG elements (no D3 or Chart.js).
- **Geospatial Mapping**: Integrated Leaflet map with custom city-to-coordinate mapping for employee distribution.
- **Secure Auth**: Persistent Context-based authentication with protected route guards.

## 🐛 Intentional Bug: Memory Leak

**Location**: `src/pages/DetailsPage.jsx` (Lines 115-122)

**What is it?**: I have intentionally removed the cleanup logic in the `useEffect` hook that manages the camera stream. 

**Why?**: This is a classic "hardware leak". When the user enables the camera and then navigates back to the list or analytics page without capturing a photo, the `MediaStream` tracks are never stopped. This keeps the browser's camera active (the green light stays on), consumes system resources, and can prevent other applications from accessing the camera until the tab is closed.

## 📐 Virtualization Math

The virtualization logic in `ListPage.jsx` works as follows:
1. **Viewport Calculation**: We define a fixed `containerHeight` (600px).
2. **Scroll Tracking**: The `onScroll` event updates the `scrollTop` state.
3. **Index Calculation**: 
   - `startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)`
   - `endIndex = Math.min(data.length - 1, startIndex + Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER)`
4. **Rendering**: Only a slice of data (`data.slice(startIndex, endIndex)`) is rendered.
5. **Positioning**: The visible slice is wrapped in a container with a `translateY` offset calculated as `startIndex * ROW_HEIGHT`, keeping it perfectly aligned with the scroll position of the parent's "phantom" height (`data.length * ROW_HEIGHT`).

## 🗺️ City-to-Coordinate Mapping

Since the API provides city names but no coordinates, I implemented a robust mapping object `CITY_COORDS` in `AnalyticsPage.jsx` which contains coordinates for major cities. If a city from the API matches a key in this object, a marker is rendered on the Leaflet map.

## 🛠️ Tech Stack

- **Framework**: Vite + React
- **Styling**: Tailwind CSS (No UI libraries)
- **Maps**: Leaflet (No D3 for charts)
- **State**: React Context API
