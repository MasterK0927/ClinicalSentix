const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

//search based drug data....
// Read drug data from JSON file
const drugDatabase = JSON.parse(fs.readFileSync("data_final.json", "utf-8"));

// Route to handle drug search
app.get("/api/search/:drugname", (req, res) => {
  const { drugname } = req.params;

  // Check if the drug exists in the database
  const drugInfo = drugDatabase[drugname];
  if (drugInfo) {
    // If found, return the drug information
    res.json(drugInfo);
  } else {
    // If not found, return 404 status with error message
    res.status(404).json({ error: "Drug not found" });
  }
});

//route for handling the sales data

app.get("/api/sales", (req, res) => {
  //generating random sales data
  const salesData = {
    salesAmount: Math.floor(Math.random() * 1000000), 
    annualTarget: Math.floor(Math.random() * 1000000) 
};

console.log(salesData);

  res.json(salesData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
