export const profileFunction = (req, res, db) => {
    const { id } = req.params;
    db.select('*').from('users').where('id', id)
        .then(user => {
            if (user.length > 0) {
                res.json(user);
            } else {
                res.status(404).json('User not found')
            }
        })
        .catch(err => err.status(400).json("error while getting this user profile"))
}

export default { profileFunction };