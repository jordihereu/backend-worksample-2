CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -- TODO: This data should not be here but in the test folder, as we don't want those records to be created in prod
-- INSERT INTO users (name, email) VALUES ('john1', 'john1@example.com');
-- INSERT INTO users (name, email) VALUES ('john2', 'john2@example.com');
-- INSERT INTO users (name, email) VALUES ('john3', 'john3@example.com');