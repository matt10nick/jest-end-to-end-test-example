# Jest Functional Test Example

## Overview

This project is an example microservice that highlights stateful functional testing using Jest. It does not follow many best practices, nor does it implement the necessary security measures for a production environment. Its intent is to highlight the use of Mock Service Worker and Mongodb Memory Server.  

The microservice has two routes. 
  /reservations provides a set of CRUD operations to store seat reservations in a Mongo database. 
  /payment, is a simple addition function. It takes a number, and adds it to the current balance, simulating a basic payment system.

Jest is used at the testing framework. 

## Built with CoPilot

The microservice and the test were built almost entirely using the GitHub Copilot prompt, requesting that it write code, or alter it to accomplish various goals. Only a few lines of code were directly edited to address bugs. The variable names, functions, etc... were almost all chosen by GitHub.   

## Not intended as a project starter

This code is very basic and does implement the necessary logging or security for production use. 

## Testing

The database and service used by this code are exposed via stateful mocks during testing. 

**Supertest** - is used to expose the microservices routes during testing. 
**Mock Service Worker** - This code intercepts API calls made from the microservice. It instead routes the requests to stateful mocks. 
**mongodb-memory-server** - Spins up a fully functional instance of monogo in memory on a free port. The tests override the connection string in the configuration file, allowing the code to connect to the memory instance of the database. 

## API Endpoints

- `GET /payment`: Get the total amount of all payments.
- `POST /payment`: Make a payment.

## Built With

- [Koa.js](https://koajs.com/) - The web framework used
- [MongoDB](https://www.mongodb.com/) - The database used
- [Jest](https://jestjs.io/) - The testing framework used
- [MSW](https://mswjs.io/) - Used to mock a service worker for testing

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details