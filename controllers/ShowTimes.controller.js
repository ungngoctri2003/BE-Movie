const { ShowTimes, Films, Cinemas, Rooms, GroupCinemas, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const create = async (req, res) => {
    const { idFilm, showDate, idCinema, idRoom } = req.body;
    try {
        const newShowTimes = await ShowTimes.create({ idFilm, showDate, idCinema, idRoom });
        res.status(201).send({
            message: "Tạo lịch chiếu thành công",
            data: newShowTimes
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    const { name } = req.query;
    try {
        const listShowTimes = await sequelize.query(`select distinct showtimes.id ,films.nameFilm ,cinemas.name AS nameCinema ,groupcinemas.groupName ,rooms.roomName ,showDate ,showtimes.createdAt ,showtimes.updatedAt, count(*) as numberTicket
        from (((((showtimes 
        inner join films on showtimes.idFilm = films.id)
        inner join cinemas on showtimes.idCinema = cinemas.id)
        inner join rooms on showtimes.idRoom = rooms.id)
        inner join groupcinemas on cinemas.idGroupCinema = groupcinemas.id)
        inner join seats on showtimes.id = seats.idShowTime)
        where films.nameFilm like '%${name}%' and showtimes.isActive = true
        group by seats.idShowTime`, { type: QueryTypes.SELECT })
        res.status(200).send(listShowTimes);

    } catch (error) {
        res.status(500).send(error);
    }
}
const showtimesWithGroupCinemas = async (req, res) => {
    const { idFilm } = req.query;
    try {
        const listGroupCinema = await sequelize.query(`select * from groupcinemas where isActive = true `, { type: QueryTypes.SELECT });
        let hack = [];
        for (const groupCinemas of listGroupCinema) {
            const listCinemas = await sequelize.query(`
            select * from cinemas where idGroupCinema = ${groupCinemas.id} and isActive = true`, {
                type: QueryTypes.SELECT
            });
            for (const cinema of listCinemas) {
                let listFilm;
                cinema.listFilm = []
                if (idFilm === '') {
                    listFilm = await sequelize.query(`
                    select distinct  films.id as idFilm,  films.nameFilm , films.imgFilm 
                    from films 
                    inner join showtimes on films.id = showtimes.idFilm
                    where showtimes.idCinema = ${cinema.id}`, { type: QueryTypes.SELECT });
                    cinema.listFilm = listFilm;
                } else {
                    listFilm = await sequelize.query(`
                    select distinct  films.id as idFilm,  films.nameFilm , films.imgFilm 
                    from films 
                    inner join showtimes on films.id = showtimes.idFilm
                    where showtimes.idCinema = ${cinema.id} and showtimes.idFilm = ${idFilm}
                    `, { type: QueryTypes.SELECT });
                    cinema.listFilm = listFilm;
                }
                for (const film of listFilm) {
                    const lstShowDate = await sequelize.query(`select showtimes.id,  showDate
                    from showtimes 
                    inner join films on films.id = showtimes.idFilm
                    inner join cinemas on cinemas.id = showtimes.idCinema
                    where cinemas.id = ${cinema.id} and films.id = ${film.idFilm} and showtimes.isActive = true`, { type: QueryTypes.SELECT });
                    film.lstShowDate = lstShowDate;
                }

            }
            groupCinemas.listRap = listCinemas;
            hack = [...hack, groupCinemas]
        }
        res.status(200).send(hack)
    } catch (error) {
        res.status(500).send(error);
    }
}
const getShowTimeWithIDCinemaIDFilm = async (req, res) => {
    const { idFilm, idCinema } = req.query;
    try {
        const lstShowDate = await sequelize.query(`
                select showtimes.id,  showDate
                from showtimes 
                inner join films on films.id = showtimes.idFilm
                inner join cinemas on cinemas.id = showtimes.idCinema
                where showtimes.isActive = true and cinemas.id = ${idCinema} and films.id = ${idFilm}`, { type: QueryTypes.SELECT });
        res.status(200).send(lstShowDate);
    } catch (error) {
        res.status(500).send(error)
    }
}
const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await ShowTimes.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                },
                {
                    model: Rooms,
                    as: 'room'
                }
            ]
        });
        details.idFilm = undefined;
        details.idCinema = undefined;
        details.idRoom = undefined;
        res.status(200).send(details);
    } catch (error) {
        res.status(500).send(error);
    }
}

const deleteShowTimes = async (req, res) => {
    try {
        const details = req.details;
        const showTimeDelete = await ShowTimes.findOne({
            where: {
                id: details.id,
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                },
                {
                    model: Rooms,
                    as: 'room'
                }
            ]
        });
        showTimeDelete.isActive = false;
        await showTimeDelete.save();
        showTimeDelete.idFilm = undefined;
        showTimeDelete.idCinema = undefined;
        showTimeDelete.idRoom = undefined;
        res.status(200).send(showTimeDelete);
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { idFilm, showDate, idCinema, idRoom } = req.body;
    const { details } = req;
    try {
        details.idFilm = idFilm;
        details.showDate = showDate;
        details.idCinema = idCinema;
        details.idRoom = idRoom;
        await details.save();
        const updated = await ShowTimes.findOne({
            where: {
                id: details.id
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Rooms,
                    as: 'room'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                }
            ]
        });
        updated.idFilm = undefined;
        updated.idCinema = undefined;
        updated.idRoom = undefined;
        res.status(200).send({
            message: "Cập nhật lịch chiếu thành công",
            data: updated
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    create,
    getAll,
    getDetails,
    deleteShowTimes,
    update,
    getShowTimeWithIDCinemaIDFilm,
    showtimesWithGroupCinemas
}