const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getAll);
router.patch("/:id",usersController.updateIsApproved);
router.put("/:id",usersController.updateUserDetails);
router.post("/",usersController.signup);
module.exports = router;