export async function createReportWithInitialVote(pool, reportData, userId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const insertReportQuery = `
      INSERT INTO report (user_id, type_id, zone_id, title, description, point, image_url, status, severity)
      VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8, 'pending', $9)
      RETURNING *;
    `;
        const reportValues = [
            userId,
            reportData.type_id,
            reportData.zone_id,
            reportData.title,
            reportData.description,
            reportData.longitude,
            reportData.latitude,
            reportData.image_url,
            reportData.severity
        ];
        const reportResult = await client.query(insertReportQuery, reportValues);
        const newReport = reportResult.rows[0];

        const insertVoteQuery = `
      INSERT INTO vote (report_id, user_id, value)
      VALUES ($1, $2, $3);
    `;
        await client.query(insertVoteQuery, [newReport.id, userId, true]);

        await client.query('COMMIT');
        return newReport;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}