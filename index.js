var express = require('express');
var { graphqlHTTP }  = require('express-graphql');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const {userSchema} = require('./schema/employee')

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
  




let app = express();
app.use('/graphql/user', graphqlHTTP({
    schema: userSchema,
    graphiql: true, 
  }));

//Start Server to listen
app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));