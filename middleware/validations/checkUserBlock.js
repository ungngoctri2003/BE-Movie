const { Users } = require('../../models');
const checkUserBlock = async (req, res, next) => {
    const { id } = req.params;
    const details = await Users.findOne({
        where: {
            id,

        }
    });
    if (details) {
        if (details.isBlock === 0) {
            req.details = details;
            next();
        } else {
            res.status(403).send(`Tài khoản bị khóa`)
        }
    } else {
        res.status(404).send(`Not Found ID =${id}`)
    }
}
module.exports = {
    checkUserBlock
}