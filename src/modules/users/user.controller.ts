import { Request, Response } from 'express';
import * as userService from './user.service';
import { AppError } from '../../common/errors/appError';
import { ValidationError } from '../../common/errors/validationError';

async function createUser(req: Request, res: Response) {
    try {
        const { name, email } = req.body;

        // TODO: Extract to a validator. RequiredFieldsValidator?
        if (!name || !email) {
            throw new ValidationError('name and email are required');
        }

        const user = await userService.createUser({ name, email });
        return res.status(201).json(user);
    } catch (err: any) {
        return handleErrors(err, res);
    }
}

async function listUsers(req: Request, res: Response) {
    const sortByCreationDate = req.query.created as string | undefined;

    try {
        const users = await userService.getUsers({ sortByCreationDate: sortByCreationDate });
        return res.status(200).json({ users });
    } catch (err) {
        return handleErrors(err, res);
    }
}

// Centralised error handling
// forces standaritzacion in the response
// enables logging exceptions in a standard way
function handleErrors(err: any, res: Response) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message, code: err.code });
    }

    return res.status(500).json({ error: 'Internal server error' });
}

export default {
    createUser,
    listUsers,
};
