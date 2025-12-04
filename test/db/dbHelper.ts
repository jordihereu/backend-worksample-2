import { getPool } from '../../src/db/pool';


export async function cleanDatabase() {
    const pool = getPool();
    await pool.query('TRUNCATE TABLE users');
}

type UserInput = {
    name: string;
    email: string;
    created?: Date;
};

export async function createUsers(users: UserInput[]) {
    for (const user of users) {
        await createUser(user.name, user.email, user.created);
    }
}

export async function createUser(name: string, email: string, creationDate?: Date) {
    const pool = getPool();

    const query = `
    INSERT INTO users (name, email, created)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created
  `;

    const values = [name, email, creationDate ?? new Date()];

    const result = await pool.query(query, values);

    return result.rows[0];
}