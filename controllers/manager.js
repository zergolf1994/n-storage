const fs = require("fs-extra");
const path = require("path");
const { GetData } = require("../utils/ffmpeg");

exports.FileList = async (req, res) => {
  try {
    const { folder, fileName, page, per_page } = req?.query;

    const folderPath =
      folder != ("undefined" || "null" || undefined)
        ? path.join(global.dirPublic, folder)
        : global.dirPublic;

    const lists = await fs.readdir(folderPath);

    const fileInfoList = [];

    for (const file of lists) {
      const filePath = `${folderPath}/${file}`;
      const stats = await fs.stat(filePath);

      const fileInfo = {
        name: file,
        type: stats.isFile() ? "file" : "directory",
        size: stats.size, // ขนาดไฟล์ในไบต์
      };

      fileInfoList.push(fileInfo);
    }

    // แบ่งรายการข้อมูลเป็นหน้า
    const pageCurrent = Number(page) || 1;
    const perPageCurrent = Number(per_page) || 5;

    const totalItems = fileInfoList.length;
    const totalPages = Math.ceil(totalItems / perPageCurrent);
    const itemStart = pageCurrent == 1 ? 0 : (pageCurrent - 1) * perPageCurrent;
    const itemEnd =
      pageCurrent == 1
        ? perPageCurrent
        : Math.min(itemStart + perPageCurrent, totalItems);

    const fileList = fileInfoList.slice(itemStart, itemEnd) || [];

    let data = {
      row: fileList,
      pager: {
        page: page || 1,
        total_page: totalPages,
        count: totalItems,
        show: `${itemStart} - ${itemEnd}`,
      },
    };

    if (
      folder != ("undefined" || "null" || undefined) &&
      fileName != ("undefined" || "null" || undefined)
    ) {
      const videoInput = path.join(global.dirPublic, folder, fileName);
      data.video = await GetData(videoInput);
    }

    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
