"use strict";
const os = require("os");
const checkDiskSpace = require("check-disk-space").default;

module.exports = async () => {
  try {
    let pathCheck = os.userInfo().homedir;
    if (os.userInfo().homedir == "/root") {
      pathCheck = "/home";
    }
    return await checkDiskSpace(pathCheck).then((diskSpace) => {
      diskSpace.used = diskSpace?.size - diskSpace?.free;
      diskSpace.percent = (
        (diskSpace.used * 100) / diskSpace?.size ?? 0
      ).toFixed(0);
      let data = {
        diskUsed: diskSpace.used,
        diskTotal: diskSpace.size,
        diskPercent: Number(diskSpace.percent),
      };
      return data;
    });
  } catch (error) {
    return;
  }
};
