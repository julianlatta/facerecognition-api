const Clarifai = require ('clarifai');

const app = new Clarifai.App({
   apiKey: '1906e7be32f94e7c8d3a2e5658d2a9ab'
 });

const handleApiCall = (req, res) => {
   app.models
      .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .then(data => {
         res.json(data);
      })
      .catch(err => res.status(400).json('Unable to connect to API'))
}

// Whenever a user enters an image, their entry count is increased accordingly
const handleImage = (db) => (req, res) => {
   const { id } = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries => { 
     res.json(entries[0].entries);
   })
   .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
   handleImage,
   handleApiCall
}