export const signInFunction = (req, res, db, bcrypt) => {
    const { email, password } = req.body;
    if (!email ||!password) {
        return res.status(400).json('Please provide email and password')
    }
    db.select('email', 'hashpassword').from('login').where('email', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hashpassword)
            if (isValid) {
                return db.select('*').from('users').where('email', email)
                    .then(data => {
                        res.json(data);
                    })
                    .catch(err => res.status(404).json('enable to get user'))
            } else {
                res.status(401).json('wrong password')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
}

export default { signInFunction };