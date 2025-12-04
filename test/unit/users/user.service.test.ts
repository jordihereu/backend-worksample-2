import { createUser } from '../../../src/modules/users/user.service';
import * as repo from '../../../src/modules/users/user.repository';
import { ConflictError } from '../../../src/common/errors/conflictError';
import { jest, describe, expect, test, beforeEach } from '@jest/globals';

jest.mock('../../../src/modules/users/user.repository'); // mock the entire repo module

describe('Unit test: UserService.createUser', () => {
    const userData = {
        name: 'John',
        email: 'john@example.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Creates a user when email does not exist', async () => {
        // repo.findUserByEmail should return null (means: no existing user)
        jest.mocked(repo.findUserByEmail).mockResolvedValue(null);

        const mockCreatedUser = {
            id: 1,
            name: 'John',
            email: 'john@example.com',
        };

        jest.mocked(repo.createUser).mockResolvedValue(mockCreatedUser);

        const result = await createUser(userData);

        expect(repo.findUserByEmail).toHaveBeenCalledWith('john@example.com');
        expect(repo.createUser).toHaveBeenCalledWith(userData);
        expect(result).toEqual(mockCreatedUser);
    });

    test('Throws ConflictError if email already exists', async () => {
        
        jest.mocked(repo.findUserByEmail).mockResolvedValue({
            id: 1,
            name: 'Existing',
            email: 'john@example.com',
        });

        await expect(createUser(userData)).rejects.toThrow(ConflictError);

        expect(repo.findUserByEmail).toHaveBeenCalledWith('john@example.com');
        expect(repo.createUser).not.toHaveBeenCalled();
    });
});
