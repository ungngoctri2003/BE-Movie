
const authorize = (req, res, next) => {
    const { user } = req;
    if (["ADMIN", "SUPPER_ADMIN"].findIndex(ele => ele === user.type) > -1) {
        next();
    } else {
        res.status(403).send("Bạn không có quyền");
    }

}

module.exports = {
    authorize
}