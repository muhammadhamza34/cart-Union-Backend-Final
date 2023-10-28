const express = require("express");
const { initialData } = require("../../controller/admin/initialData");
const { requireSignin, adminMiddleware} =require('../../common-middleware/index');
const router = express.Router();

router.post("/initialdata", requireSignin, adminMiddleware, initialData);

module.exports = router;
