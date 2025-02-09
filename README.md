# vue-timeseries-app/README.md

# Vue Timeseries App

This project is a Vue.js application that displays timeseries data in a responsive table and visualizes it with a line chart. The data is sourced from a JSON file given to me as an assignment from StellarBlue and presented using Bootstrap mostly for styling.

## Project Structure

```
vue-timeseries-app
├── public
│   ├── index.html               # Main HTML file for the application
├── src
│   ├── assets
│   │   └── timeseries.json      # JSON file containing timeseries data given from StellarBlue
│   │   └── global.css           # Some css applied to the whole project
│   ├── components
│   │   ├── DataTable.vue        # Component for displaying data in a table
│   │   └── LineChart.vue        # Component for visualizing data with a line chart
│   │   └── AlertModal.vue       # Component for all the modals we used(reusable)
│   │   └── DatePicker.vue       # Component for the required date picker
│   │   └── Filters.vue          # Component for filtering out/include series fields(prices)
│   │   └── TableHeader.vue      # Component for Table's headers(reusable)
│   │   └── TableRow.vue         # Component for Table's rows(reusable)
│   │   └── DarkModeToggle.vue   # Basic bootrstrap theme mode (dark or light)
│   │   └── CustomLegend.vue     # Simple custom legends to remove line chart's ugly ones
│   ├── router
│   │   └── index.js             # Main view component
│   ├── views
│   │   └── Home.vue             # Main view component
│   ├── App.vue                  # Root Vue component
│   ├── main.js                  # Entry point of the application
│   ├── server.js                # "Backend" addition to have saving/changing the json functionallity
├── package.json                 # npm configuration file
├── package-lock.json            # npm configuration file
├── README.md                    # Your currently reading me! Project documentation
└── vue.config.js                # Vue CLI configuration settings
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/Savvassidi/StellarBlueAssignment.git

   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm run serve           # Custom made to run the server locally also (see package.json)
   ```

4. **Open your browser:**
   Browser should open automatically, if not open it and navigate to `http://localhost:8081` to view the application.

## Features

- Responsive table to display timeseries data.
   - Editable table by the user
   - Option to save the changes to the "backend"(json existing file) from the UI.
   - Export the whole data set to CSV through a click of a button
   - Show more button to gradually assert data to the page
- Line chart visualization of data trends over time, changing live through user's input.
- Filters to showcase only the desired Timeseries fields/data.
- Date picker to filter data for a given period.
- Dark mode toggle for switching between light and dark themes.
- Utilizes Bootstrap for styling and layout.
- Several micro additions and customisations, such as touching the layout of chart with custom legends

## Technologies Used

- Vue.js
- Bootstrap
- Chart.js
- element-plus

## Contribution Guidelines
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes and commit them (git commit -m 'Add some feature').
- Push to the branch (git push origin feature-branch).
- Open a pull request.

## License

This project is licensed under the MIT License.

## Copyright

Copyright (c) 2025 Savvassidi