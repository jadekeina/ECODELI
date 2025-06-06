const express = require("express");

function applyMiddlewares(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

module.exports = applyMiddlewares;
