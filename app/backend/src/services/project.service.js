const pool = require("../config/db");

const createProject = async (userId, name, language, code, stdin) => {
    const result = await pool.query(
        `
        INSERT INTO
        projects (id, user_id, name, language, code, stdin)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
        RETURNING id
        `, [userId, name, language, code, stdin]
    );
    return result.rows[0];
};

const getProjects = async (userId) => {
    const result = await pool.query(
        `
        SELECT id, name, language, updated_at
        FROM projects
        WHERE user_id = $1
        ORDER BY updated_at DESC
        `, [userId]
    );
    return result.rows;
};

const getProjectById = async (userId, projectId) => {
    const result = await pool.query(
        `
        SELECT * FROM projects
        WHERE id = $1
        AND user_id = $2
        `, [projectId, userId]
    );
    return result.rows[0];
};

const updateProject = async (userId, projectId, name, language, code, stdin) => {
    const result = await pool.query(
        `
        UPDATE projects
        SET
            name = $1,
            language = $2,
            code = $3,
            stdin = $4,
            updated_at = NOW()
        WHERE id = $5
        AND user_id = $6
        RETURNING *
        `, [name, language, code, stdin, projectId, userId]
    );
    return result.rows[0];
}

const deleteProject = async (userId, projectId) => {
    const result = await pool.query(
        `
        DELETE FROM projects
        WHERE id = $1
        AND user_id = $2
        `, [projectId, userId]
    );
    return result.rows[0];
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };