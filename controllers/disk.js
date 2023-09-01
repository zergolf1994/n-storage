const { Server } = require("../models");
const checkDisk = require("../utils/checkDisk");
const getOs = require("../utils/getOs");

exports.DiskUpdate = async (req, res) => {
  try {
    let { ipV4 } = getOs();

    const server = await Server.List.findOne({
      type: "storage",
      svIp: ipV4,
    }).select(`_id svIp`);

    let disk = await checkDisk();
    let dataUpdate = {
      ...disk,
    };
    if (disk?.diskPercent > 50) dataUpdate.active = false;
    await Server.List.findByIdAndUpdate(
      { _id: server?._id },
      { ...dataUpdate }
    );

    return res.json({ ...disk });
  } catch (err) {
    console.log(err);
    return res.json({ error: true });
  }
};
