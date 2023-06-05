const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect('mongodb+srv://abc:abc12@cluster0.9mlr55g.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Database connection error:', error));
};

module.exports = { connect };
