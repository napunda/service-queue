import { connection } from "../../config/db.connection.mjs";

export const FileModel = {
    findById: (uuid, callback) => {
        const sql = 'SELECT * FROM files_compress_queues WHERE id = ?';
        connection.query(sql, [uuid], callback);
    },
    updateStatus: (id, statusId, callback) => {
        const sql = 'UPDATE files_compress_queues SET status_id = ? WHERE id = ?';
        connection.query(sql, [statusId, id], callback);
    }
};
