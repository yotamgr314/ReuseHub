// // IMPORTS SECTION
// const UserMongooseModel = require('../models/user.model.js');

// /* Create new user */
// exports.createUser = async (req, res) => {
//     try {
//         const newUser = await UserMongooseModel.create(req.body); // NOTE - create() is a built in mongoose function which creates an instance of document and saves it to MongoDB, it returns a promise.
//         res.status(201).json(newUser); // Respond with the saved user

//     } catch (err) {
//         res.status(400).json({
//             message: err.message
//         });
//     }
// };

// // Get all users
// exports.getUsers = async (req, res) => {
//     try {
//         const users = await UserMongooseModel.find(); // NOTE - find() is a built in mongoose function that returns all the users documents in the mongoDB, it returns a promise.

//         if (users.length === 0) {
//             return res.status(200).json([]); // Return an empty array with a 200 status
//         }

//         res.status(200).json(users); // Send back the list of users

//     } catch (err) {
//         res.status(500).json({ message: err.message }); // Handle server errors
//     }
// };

// // Get user by ID
// exports.getUserById = async (req, res) => {
//     try {
//         const queriedUser = await UserMongooseModel.findById(req.params.id); // NOTE - findById is a built in mongooseDB function which finds an document by its id, req.params.id is the way to acesss the URL parameters, as we defined them in the router path.
//         // that means - if we would have defined the router path to be router.get('/:userId', getUserById); than the await would look like that : User.findById(req.params.userId);

//         if (!queriedUser) {
//             return res.status(404).json({ message: 'User not found' }); // If findById returns null (no user with that ID exists), send a 404 Not Found response.
//         }

//         res.status(200).json(queriedUser); // Respond with the user data
//     } catch (err) {
//         res.status(500).json({ message: err.message }); // Handle server errors
//     }
// };

/* WORKING RULES
01) req.params - used to obtain parameters which are passed as part of the URL path.
route example: users/:userId
how does the userId gets into the URL path parameter ?
well either:
    01) Server Redirects to a URL with userId:
        After successful login, the server or frontend includes the userId in the URL path to access it later.
        res.redirect(`/users/${userId}`); // Redirects to a route with userId in the path
    02) Frontend Generates the URL with userId
        After the user logs in, the frontend receives the userId from the server and includes it in subsequent requests.
    03) Instead of passing the userId directly in the URL, the server generates a token (e.g., JWT) after login, which encodes the userId. The client sends this token in subsequent requests.


02) req.query - used to obtain querystring parameters, mostly used by sorting/filtering GET requests.
URL example: users?role=adming&page=2/

03) req.body - used when data is passed inside the POST/PUT/PATCH request body, usually as json format or form format.
example of request with JSON body:
{
"name": "John Doe",
"email": "john@example.com"
} 







*/
