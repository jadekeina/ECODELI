const express = require("express");
const router = express.Router();
const createUser = require("../../controllers/users/createUser");
const { isPostMethod } = require("../../librairies/method");
const { jsonResponse } = require("../../librairies/response");

router.post("/", async (req, res) => {
  if (!isPostMethod(req)) {
    return jsonResponse(res, 405, {}, { message: "Method Not Allowed" });
  }

  try {
    const user = await createUser(req.body);
    return jsonResponse(res, 201, {}, { message: "User created", user });
  } catch (error) {
    console.error("Error creating user:", error);
    return jsonResponse(res, 500, {}, { message: "Internal Server Error", error: error.message });
  }
});

module.exports = router;
