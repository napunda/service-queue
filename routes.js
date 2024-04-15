const express = require("express")
const FilesController = require("./app/controllers/FilesController.js")

const router = express.Router();

router.get('/donwload-files/:uuid', FilesController.getFileById);

module.exports = router;
