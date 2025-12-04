import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import usersRoutes from "./modules/users/user.routes";

dotenv.config();

const app: Express = express();
// const userService = new UserService();

app.use(cors()).use(express.json()).options('*', cors());

// app.post('/users', (req: Request, res: Response) => {
//     // userService.createUser()
//     let status = req.body.email && req.body.name ? 201 : 400;
//     res.status(status).send({});
// });

// app.get('/users', (req: Request, res: Response) => {
//     res.send({
//         users: [
//             { id: 1, name: '1' },
//             { id: 2, name: '2' },
//             { id: 3, name: '3' },
//         ],
//     }).status(200);
// });

app.use("/users", usersRoutes);

export default app;
