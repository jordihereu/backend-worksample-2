import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { afterAll, beforeAll, describe, expect, test, beforeEach } from '@jest/globals';
import request from 'supertest';
import { closePool, getPool } from '../../../src/db/pool';
import { createUsers, cleanDatabase } from '../../db/dbHelper';

let container: StartedPostgreSqlContainer;
let app: any;

beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15').start();
    process.env.DATABASE_URL = container.getConnectionUri();
    getPool();

    // TODO: This is a bit tricky, but for now it works
    // we are not importing the migrate script until the DB container is up and running
    // to avoid the App instantiating the pool before db is there
    const { runMigrations } = await import('../../../src/db/migrate');
    await runMigrations();

    app = (await import('../../../src/app')).default;
}, 30000);

beforeEach(async () => {
    // Should empty the database before each test run
    await cleanDatabase();
});

afterAll(async () => {
    await closePool();
    await container.stop();
}, 30000);

describe('Integration test: POST /User', () => {
    test('Fails to create a user without email', async () => {
        const response = await request(app).post('/users').send({ name: 'John' });
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
        expect(response.body.error).toBe('name and email are required');
    });

    test('Fails to create a user without name', async () => {
        const response = await request(app).post('/users').send({ email: 'john@example.com' });
        expect(response.statusCode).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
        expect(response.body.error).toBe('name and email are required');
    });

    test('Fails to create a user with an exising email', async () => {
        // Given
        await createUsers([{ name: 'john1', email: 'john1@example.com' }]);

        // When
        const response = await request(app)
            .post('/users')
            .send({ name: 'john1', email: 'john1@example.com' });

        // Then
        expect(response.statusCode).toBe(409);
        expect(response.body.code).toBe('CONFLICT_ERROR');
        expect(response.body.error).toBe('Email already in use');
    });

    test('Creates a user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'laura', email: 'laura@example.com' });
        expect(response.statusCode).toBe(201);
    });
});

// TODO: move this bit another place to reduce noise
const yesterday = new Date(new Date().setDate(14));
const today = new Date(new Date(yesterday).setDate(15));
const tomorrow = new Date(new Date(yesterday).setDate(16));

describe('Integration test: GET /users', () => {
    test('Fails to get all users due to unexpected value', async () => {
        const response = await request(app).get('/users?created=unexpected_value');
        expect(response.status).toBe(400);
        expect(response.body.code).toBe('VALIDATION_ERROR');
        expect(response.body.error).toBe('Invalid sort option');
    });

    test('Gets all users without specific sorting', async () => {
        // Given
        const users = [
            { name: 'john1', email: 'john1@example.com', created: today },
            { name: 'john2', email: 'john2@example.com', created: yesterday },
            { name: 'john3', email: 'john3@example.com', created: tomorrow },
        ];
        await createUsers(users);

        // When
        const response = await request(app).get('/users');

        // Then
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);

        const returnedNames = response.body.users.map((u: any) => u.name);
        // Not asserting the order
        expect(returnedNames).toEqual(expect.arrayContaining(users.map((u) => u.name)));
    });

    test('Gets all users sorted sorted creation date ascending', async () => {
        // Given
        const users = [
            { name: 'john1', email: 'john1@example.com', created: today },
            { name: 'john2', email: 'john2@example.com', created: yesterday },
            { name: 'john3', email: 'john3@example.com', created: tomorrow },
        ];

        await createUsers(users);

        // When
        const response = await request(app).get('/users?created=ascending');
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);

        const result = response.body.users as Array<{ name: string }>;

        // Asserting the order
        expect(result.map((u) => u.name)).toEqual(['john2', 'john1', 'john3']);
    });

    test('Gets all users sorted sorted creation date descending', async () => {
        // Given
        const users = [
            { name: 'john1', email: 'john1@example.com', created: today },
            { name: 'john2', email: 'john2@example.com', created: yesterday },
            { name: 'john3', email: 'john3@example.com', created: tomorrow },
        ];
        await createUsers(users);

        // When
        const response = await request(app).get('/users?created=descending');

        // Then
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);

        const result = response.body.users as Array<{ name: string }>;

        // Asserting the order
        expect(result.map((u) => u.name)).toEqual(['john3', 'john1', 'john2']);
    });
});
