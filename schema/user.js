const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
} = require("graphql");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});


const Login = new GraphQLObjectType({
  name: "Login",
  fields: {
    user: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        
        const { username, email, password } = args;
        console.log(username,email,password)
        const errors = [];

        if (!username && !email) {
          errors.push("Username or email is required to login");
        }

        if (password.length < 6) {
          errors.push("Password must be at least 6 characters long");
        }

        if (errors.length > 0) {
          throw new Error(errors.join(", "));
        }

        let user;
        if (username) {
          user = await User.findOne({ username });
        } else if (email) {
          user = await User.findOne({ email });
        }

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    },
  },
});




const Register = new GraphQLObjectType({
  name: "Register",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const { username, email, password } = args;
        const errors = [];

        if (username.length < 3) {
          errors.push("Username must be at least 3 characters long");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          errors.push("Invalid email format");
        }

        if (password.length < 6) {
          errors.push("Password must be at least 6 characters long");
        }

        if (errors.length > 0) {
          throw new Error(errors.join(", "));
        }
        
        const existingUser = await User.findOne({
          $or: [{ username }, { email }]
        });

        if (existingUser) {
          throw new Error("User with that username or email already exists.");
        }

        const newUser = new User({
          username,
          email,
          password: password,
        });

        return newUser.save();
      },
    },
  },
});

const userSchema = new GraphQLSchema({
  query: Login,
  mutation: Register,
});

module.exports = { userSchema };
