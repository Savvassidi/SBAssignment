const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Path to timeseries.json
const filePath = "./src/assets/timeseries.json";

/**
 * Save the updated timeseries data with a delayed response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post("/save-timeseries", (req, res) => {
    const updatedData = req.body;

    // Wait for 3 seconds before sending the response
    setTimeout(() => {
        fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ message: "Failed to save data" });
            }

            console.log("Data saved successfully (Response delayed 3s)!");
            res.json({ message: "Data saved successfully!" });
        });
    }, 3000);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});