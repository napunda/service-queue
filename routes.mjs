import express from "express";
import { FileController } from "./app/controllers/FilesController.mjs";

const router = express.Router();

router.get('/donwload-files/:uuid', FileController.getFileById);

export default router;
