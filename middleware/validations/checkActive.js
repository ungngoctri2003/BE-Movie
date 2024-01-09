
const checkActive = (Model) => {
    return async (req, res, next) => {
        const { id } = req.params;
        const details = await Model.findOne({
            where: {
                id
            }
        });
        if (details) {
            if (details.isActive) {
                req.details = details;
                next();
            } else {
                res.status(404).send(`NOT ACTIVE`)
            }
        } else {
            res.status(404).send(`Not Found ID =${id}`)
        }
    }
}
module.exports = {
    checkActive
}