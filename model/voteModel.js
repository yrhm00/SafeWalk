import pool from "../database/database.js";

// Met/Change le vote de l'utilisateur pour un report (1 vote/user/report)
export async function setVote({ report_id, user_id, value }) {
    // Essaye d'update, sinon insert
    const up = await pool.query(
        `
    UPDATE votes
    SET value = $3, created_at = NOW()
    WHERE report_id = $1 AND user_id = $2
    RETURNING id, report_id, user_id, value, created_at
    `,
        [report_id, user_id, value]
    );
    if (up.rows[0]) return up.rows[0];

    const ins = await pool.query(
        `
    INSERT INTO votes (report_id, user_id, value)
    VALUES ($1,$2,$3)
    RETURNING id, report_id, user_id, value, created_at
    `,
        [report_id, user_id, value]
    );
    return ins.rows[0];
}

export async function removeMyVote({ report_id, user_id }) {
    await pool.query(`DELETE FROM votes WHERE report_id = $1 AND user_id = $2`, [report_id, user_id]);
}

export async function countByReport(report_id) {
    const r = await pool.query(
        `
    SELECT
      SUM(CASE WHEN value = TRUE THEN 1 ELSE 0 END)::int AS upvotes,
      SUM(CASE WHEN value = FALSE THEN 1 ELSE 0 END)::int AS downvotes,
      COUNT(*)::int AS total
    FROM votes
    WHERE report_id = $1
    `,
        [report_id]
    );
    return r.rows[0];
}