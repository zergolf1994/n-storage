"use strict";

const fs = require("fs-extra");
const path = require("path");
const { File, Server } = require("../models");
const checkDisk = require("../utils/checkDisk");

exports.DeleteDir = async (req, res) => {
  try {
    let { slug, serverId, fileId } = req.body;
    if (!slug || !serverId || !fileId)
      return res.json({ error: true, msg: "ข้อมูลไม่ครบ" });

    let deleteTarget = path.join(global.dirPublic, slug);
    await fs.remove(deleteTarget);

    // ลบไฟล์ data
    const dbDelete = await File.Data.deleteMany({
      fileId,
      serverId,
    });

    if (dbDelete?.deletedCount > 0) {
      // อัพเดตดิส
      let disk = await checkDisk();
      let dataUpdate = {
        ...disk,
      };
      if (disk?.diskPercent > 95) dataUpdate.active = false;
      await Server.List.findByIdAndUpdate({ _id: serverId }, { ...dataUpdate });

      return res.json({
        msg: "ลบไฟล์สำเร็จ",
      });
    } else {
      return res.json({ error: true, msg: `ลองอีกครั้ง` });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: true, msg: "ผิดพลาด" });
  }
};

exports.DeleteFile = async (req, res) => {
  try {
    let { slug, serverId, videoId, name } = req.body;
    if (!slug || !serverId || !videoId || !name)
      return res.json({ error: true, msg: "ข้อมูลไม่ครบ" });

    let deleteTarget = path.join(global.dirPublic, slug, `file_${name}.mp4`);
    try {
      await fs.remove(deleteTarget);
    } catch (error) {}

    let DirTarget = path.join(global.dirPublic, slug);
    const lists = await fs.readdir(DirTarget);
    if (lists?.length) {
      try {
        await fs.remove(DirTarget);
      } catch (error) {}
    }

    // ลบไฟล์ data
    const dbDelete = await File.Data.deleteOne({
      _id: videoId,
      serverId,
      name: name,
    });

    if (dbDelete?.deletedCount > 0) {
      // อัพเดตดิส
      let disk = await checkDisk();
      let dataUpdate = {
        ...disk,
      };
      if (disk?.diskPercent > 95) dataUpdate.active = false;
      await Server.List.findByIdAndUpdate({ _id: serverId }, { ...dataUpdate });

      return res.json({
        msg: "ลบไฟล์สำเร็จ",
      });
    } else {
      return res.json({ error: true, msg: `ลองอีกครั้ง` });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: true, msg: "ผิดพลาด" });
  }
};
