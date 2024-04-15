import { FileModel } from "../models/FileModel.mjs";
import path from 'path';

export const FileController = {
    getFileById: (req, res) => {
        const fileId = req.params.uuid;

        FileModel.findById(fileId, (err, result) => {
            if (err) {
                console.error('Erro ao buscar o arquivo:', err);
                res.status(500).send('Erro interno do servidor');
                return;
            }

            if (result.length === 0) {
                console.log(result)
                res.status(404).send('Arquivo não encontrado');
                return;
            }

            const fileName = result[0].zip_file_name;
            const filePath = path.join('./storage/zip-files', fileName);

            res.download(filePath, fileName, async (err) => {
                if (err) {
                    console.error('Erro ao enviar o arquivo:', err);
                    res.status(500).send('Erro ao enviar o arquivo');
                    return;
                }
                try {
                    await FileModel.updateStatus(fileId, 3);
                    console.log('Status do arquivo atualizado para baixado');
                } catch (updateErr) {
                    console.error('Erro ao atualizar o status do arquivo:', updateErr);
                }
            });
        });
    }
};
