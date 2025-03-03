export const registerFunction = (req, res, db, bcrypt, saltRounds) => {
    const { username, email, password } = req.body;
    if (!username ||!email ||!password) {
        return res.status(400).json("All fields are required")
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            email: email,
            hashpassword: hash,
        }).into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                    .returning('*')
                    .insert({
                        name: username,
                        email: loginEmail[0].email,
                        joined: new Date()
                    }).then(response => {
                        res.json(response[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => err.status(400).json("unable to register"))
}

export default { registerFunction }