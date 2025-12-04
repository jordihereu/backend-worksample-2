import { getPool } from '../../db/pool';
import { User, CreateUserDTO } from './user.model';

export async function createUser(data: CreateUserDTO): Promise<User> {
    const pool = getPool();

    const result = await pool.query<User>(
        `INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email`,
        [data.name, data.email],
    );
    return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const pool = getPool();

    const result = await pool.query<User>(`SELECT id, name, email FROM users WHERE email = $1`, [
        email,
    ]);
    return result.rows[0] ?? null;
}

// A bit of premature complexity here, on purpose.
// I'm adding a complex model (instead of a plain string)
// to enable growing this model to add filtering or more complex sorting
// As an example: I would expect pagination to be in place at some point.
export async function listAllUsers(opts?: { sortCreated?: 'asc' | 'desc' }) {
    const pool = getPool();

    let query = `SELECT id, name, email, created FROM users`;

    if (opts?.sortCreated) {
        query += ` ORDER BY created ${opts.sortCreated.toUpperCase()}`;
    }

    const result = await pool.query(query);
    return result.rows;
}
