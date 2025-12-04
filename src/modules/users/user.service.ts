import * as repo from './user.repository';
import { CreateUserDTO, User } from './user.model';
import { ConflictError } from '../../common/errors/conflictError';
import { ValidationError } from '../../common/errors/validationError';

export async function createUser(data: CreateUserDTO): Promise<User> {
    const existing = await repo.findUserByEmail(data.email);

    if (existing) {
        throw new ConflictError('Email already in use');
    }

    return repo.createUser(data);
}

export async function getUsers(params?: { sortByCreationDate?: string }): Promise<User[]> {
    let sort: 'asc' | 'desc' | undefined;

    if (params?.sortByCreationDate) {
        if (params?.sortByCreationDate === 'ascending') sort = 'asc';
        else if (params?.sortByCreationDate === 'descending') sort = 'desc';
        else throw new ValidationError('Invalid sort option');
    }

    return repo.listAllUsers({ sortCreated: sort });
}
