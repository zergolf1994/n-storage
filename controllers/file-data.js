"use strict";

const fs = require("fs-extra");

exports.FileDataSize = async (req, res) => {
  try {
    let { slug, file_name } = req.params;
    if (!slug || !file_name) return res.json({ error: true });

    let file_target = `${global.dirPublic}${slug}/${file_name}`;

    if (!fs.existsSync(file_target))
      return res.json({ error: true, msg: "no_file" });

    let stats = fs.statSync(file_target);
    let { size } = stats;
    return res.json({ size });
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
