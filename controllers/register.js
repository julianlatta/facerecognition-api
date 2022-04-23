// Registers users within the database based on email, name, password entries
const handleRegister = (db, bcrypt) => (req, res) => {
   const { email, name, password } = req.body;
   if (!email || !name || !password) {
     return res.status(400).json('Incorrect form submission');
   }
   const hash = bcrypt.hashSync(password);
      db.transaction(trx => { // Trx is used to handle multiple operations at once.
         trx.insert({
            hash: hash,
            email: email
         })
         .into('login')
         .returning('email')
         .then(loginEmail => { // Handles second trx operation.
            return trx('users')
               .returning('*')
               .insert({
                  email: loginEmail[0],
                  name: name,
                  joined: new Date()
               })
            .then(user => {
               res.json(user[0]);
            })
         })
         .then(trx.commit) // If all parameters successfully passed, commit changes in trx
         .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('Unable to register user'))
}

module.exports = {
   handleRegister: handleRegister
}