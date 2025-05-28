CREATE TABLE IF NOT EXISTS categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS level(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS quizz(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    description TEXT ,
    category_id INTEGER NOT NULL,
    level_id INTEGER NOT NULL,
    time_in_minutes INTEGER NOT NULL,
    is_global BOOLEAN NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (level_id) REFERENCES level(id)
);

CREATE TABLE IF NOT EXISTS question_type(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS question(
    id SERIAL PRIMARY KEY,
    type_id INTEGER NOT NULL,
    query VARCHAR(255) NOT NULL,
    quizz_id INTEGER NOT NULL,
    FOREIGN KEY (type_id) REFERENCES question_type(id),
    FOREIGN KEY (quizz_id) REFERENCES quizz(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    is_answer BOOLEAN NOT NULL,
    question_id INTEGER NOT NULL,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);