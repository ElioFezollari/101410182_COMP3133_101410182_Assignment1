var express = require('express');
var { graphqlHTTP }  = require('express-graphql');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const {userSchema} = require('./schema/user')
const {employeeSchema} = require('./schema/employee')
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
app.use(cors());

app.use('/graphql/user', graphqlHTTP((req, res, graphQLParams) => {
  console.log('Incoming GraphQL Request:');
  
  if (graphQLParams) {
    console.log('Query:', graphQLParams.query);
    console.log('Variables:', graphQLParams.variables);
  }

  return {
    schema: userSchema,
    graphiql: true,
  };
}));

  app.use('/graphql/employee', graphqlHTTP({
    schema: employeeSchema,
    graphiql: true, 
  }));

app.listen(4000, () => console.log('Express GraphQL Server Now Running On http://localhost:4000/graphql'));