"use strict";
const express = require("express");
const router = express.Router();

const { FileList } = require("./controllers/manager");
const { DiskUpdate } = require("./controllers/disk");
const { FileDataSize } = require("./controllers/file-data");

router.get("/manager", FileList);

router.get("/disk", DiskUpdate);

const { DeleteDir, DeleteFile } = require("./controllers/fileDelete");
router.post("/delete-dir", DeleteDir);
router.post("/delete-file", DeleteFile);

router.get("/file-size/:slug/:file_name", FileDataSize);

const { serverCreate } = require("./controllers/server");
router.get("/server/create", serverCreate);

router.all("*", async (req, res) => {
  return res.status(404).json({ error: true, msg: `link_not_found` });
});

module.exports = router;
