const { GroupCinemas } = require('../models');

const create = async (req, res) => {
    const { file, body } = req;
    const { groupName } = body;
    try {
        if (file?.path) {
            const logo = await file.path.replace(/\\/g, '/');
            const newGroupCinema = await GroupCinemas.create({ groupName, logo });
            res.status(201).send({
                message: "Thêm Rạp Chiếu thành công",
                data: newGroupCinema
            })
        } else {
            res.status(403).send("Bạn cần gửi ảnh lên để thêm rạp chiếu");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    try {
        const lstCinemas = await GroupCinemas.findAll({ where: { isActive: true } });
        res.status(200).send(lstCinemas);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetails = async (req, res) => {
    try {
        res.status(200).send(req.details);
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteGrCinemas = async (req, res) => {
    try {
        const delCinemas = req.details;
        delCinemas.isActive = false;
        await delCinemas.save();
        res.status(200).send({
            message: "Xóa Rạp thành công",
            data: delCinemas
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { file, body, details } = req;
    const { groupName } = body;
    try {
        const groupCinemaUpdate = details;
        let logo;
        if (!file) {
            logo = groupCinemaUpdate.logo;
        } else {
            logo = file.path.replace(/\\/g, '/');
        }
        groupCinemaUpdate.logo = logo;
        groupCinemaUpdate.groupName = groupName;
        await groupCinemaUpdate.save();
        res.status(200).send({
            message: "Cập nhập Cụm Rạp thành công",
            data: groupCinemaUpdate
        })
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    create,
    getAll,
    getDetails,
    deleteGrCinemas,
    update
}