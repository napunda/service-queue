const connection = require("../../config/db.connection.js")

const FileModel = {
    findById: (uuid, callback) => {
        const sql = 'SELECT * FROM files_compress_queues WHERE id = ?';
        connection.query(sql, [uuid], callback);
    },
    updateStatus: (id, statusId) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE files_compress_queues SET status_id = ? WHERE id = ?';
            connection.query(sql, [statusId, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    findOldestOne: (callback) => {
        const sql = 'SELECT * FROM files_compress_queues WHERE status_id = 1 ORDER BY created_at ASC LIMIT 1';
        connection.query(sql, callback);
    },
    updateURLDownload: (id, zipUrlDownload) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE files_compress_queues SET zip_url_download = ? WHERE id = ?'
            connection.query(sql, [zipUrlDownload, id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    updateCompletedAt: (id) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE files_compress_queues SET completed_at = NOW() WHERE id = ?'
            connection.query(sql, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};

module.exports = FileModel;
