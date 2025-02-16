const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLString, GraphQLInt,GraphQLNonNull } = require("graphql");
const Employee = require("../models/employee");
const EmployeeType = new GraphQLObjectType({
  name: "Employee",
  fields: () => ({
    id: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
    designation: { type: GraphQLString },
    salary: { type: GraphQLInt },
    date_of_joining: { type: GraphQLString },
    department: { type: GraphQLString },
    employee_photo: { type: GraphQLString },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
      getAllEmployees: {
        type: new GraphQLList(EmployeeType),
        async resolve(parent, args) {
          return await Employee.find();
        },
      },

      getEmployeeById: {
        type: EmployeeType,
        args: {
          id: { type: GraphQLString },
        },
        async resolve(parent, args) {
          const { id } = args;
          const employee = await Employee.findById(id);
          if (!employee) {
            throw new Error("Employee not found");
          }
          return employee;
        },
      },
  
      searchEmployees: {
        type: new GraphQLList(EmployeeType), 
        args: {
          designation: { type: GraphQLString }, 
          department: { type: GraphQLString }, 
        },
        async resolve(parent, args) {
          const { designation, department } = args;
  
          let query = {};
  
          if (designation) {
            query.designation = designation;
          }
  
          if (department) {
            query.department = department;
          }
  
          return await Employee.find(query); 
        },
      },
    },
  });
  

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      addEmployee: {
        type: EmployeeType,
        args: {
          first_name: { type: new GraphQLNonNull(GraphQLString) },
          last_name: { type: new GraphQLNonNull(GraphQLString) },
          email: { type: new GraphQLNonNull(GraphQLString) },
          gender: { type: GraphQLString },
          designation: { type: new GraphQLNonNull(GraphQLString) },
          salary: { type: new GraphQLNonNull(GraphQLInt) },
          date_of_joining: { type: new GraphQLNonNull(GraphQLString) },
          department: { type: new GraphQLNonNull(GraphQLString) },
          employee_photo: { type: GraphQLString },
        },
        async resolve(parent, args) {
          const {
            first_name,
            last_name,
            email,
            gender,
            designation,
            salary,
            date_of_joining,
            department,
            employee_photo,
          } = args;
  
          const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            gender,
            designation,
            salary,
            date_of_joining,
            department,
            employee_photo,
          });
  
          return await newEmployee.save();
        },
      },
  
      updateEmployee: {
        type: EmployeeType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) },
          first_name: { type: GraphQLString },
          last_name: { type: GraphQLString },
          email: { type: GraphQLString },
          gender: { type: GraphQLString },
          designation: { type: GraphQLString },
          salary: { type: GraphQLInt },
          department: { type: GraphQLString },
          employee_photo: { type: GraphQLString },
        },
        async resolve(parent, args) {
          const { id, first_name, last_name, email, gender, designation, salary, department, employee_photo } = args;
  
          let employee = await Employee.findById(id);
          if (!employee) {
            throw new Error("Employee not found");
          }
  
          if (first_name) employee.first_name = first_name;
          if (last_name) employee.last_name = last_name;
          if (email) employee.email = email;
          if (gender) employee.gender = gender;
          if (designation) employee.designation = designation;
          if (salary) employee.salary = salary;
          if (department) employee.department = department;
          if (employee_photo) employee.employee_photo = employee_photo;
  
          employee.updated_at = Date.now();
  
          return await employee.save();
        },
      },
  
      deleteEmployee: {
        type: GraphQLString, 
        args: {
          id: { type: new GraphQLNonNull(GraphQLString) }, 
        },
        async resolve(parent, args) {
          const { id } = args;
  
          const employee = await Employee.findById(id);
          if (!employee) {
            throw new Error("Employee not found");
          }
          await Employee.findByIdAndDelete(id);
  
          return "Employee deleted successfully"; 
        },
      },
    },
  });
  


  


const employeeSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = { employeeSchema };
