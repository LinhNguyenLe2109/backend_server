const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// default API
app.get("/", (req, res) => {
  res.json({
    message:
      "use /restaurant to get api from the Spoonacular, use personal to get ur own data",
  });
});

app.get("/restaurant", (req, res) => {
  res.json({
    message: "working",
  });
});

// get a list of dishes from one country
app.get("/restaurant/:cuisineType", async (req, res) => {
  try {
    let result = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY}&cuisine=${req.params.cuisineType}&number=10`
    );
    res.json(result.data.results);
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

// get data for one specific dish
app.get("/restaurant/dish/:dishID", async (req, res) => {
  try {
    let result = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.dishID}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`
    );
    const dishInfo = {
      id: result.data.id,
      title: result.data.title,
      image: result.data.image,
      // price divided by 100 to get actual price
      pricePerServing: result.data.pricePerServing,
      diets: result.data.diets,
      summary: result.data.summary,
    };
    res.json(dishInfo);
  } catch (err) {
    res.json({
      error: err.message,
    });
  }
});

app.listen(HTTP_PORT, () => {
  console.log(`server listening on: ${HTTP_PORT}`);
});
