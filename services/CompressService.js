const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const FileModel = require("../app/models/FileModel");
const axios = require('axios')

const errorLogPath = path.join(__dirname, '..', 'logs', 'error.log');
const errorLogStream = fs.createWriteStream(errorLogPath, { flags: 'a' });
process.stderr.write = errorLogStream.write.bind(errorLogStream);

const startTime = new Date();
FileModel.findOldestOne(async (err, result) => {
  if (err) {
    console.error('Erro ao buscar o registro mais antigo:', err);
    process.exit(1);
  }

  if (!result || result.length === 0) {
    console.log('Nenhum registro encontrado com status pendente!');
    process.exit();
  }

  const oldestRecord = result[0];  
  await FileModel.updateStatus(oldestRecord.id, 2);

  const remoteFolderPath = path.join(__dirname, '..', '..', 'ftp', oldestRecord.remote_path);
  const localDirectory = path.join(__dirname, '..', 'storage', 'zip-files');
  if (!fs.existsSync(localDirectory)) {
    fs.mkdirSync(localDirectory, { recursive: true });
  }

  const zipFile = path.join(localDirectory, oldestRecord.zip_file_name);
  const output = fs.createWriteStream(zipFile);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('error', err => {
    console.error('Erro ao criar o arquivo zip:', err);
    process.exit(1);
  });

  output.on('close', async () => {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    console.log('Arquivo zip criado com sucesso:', zipFile);

    await updateQueue(oldestRecord);
    console.log('Tempo de execução:', executionTime + 'ms');
    process.exit();

  });

  archive.directory(remoteFolderPath, false);
  archive.pipe(output);
  archive.finalize();
});

async function updateQueue(oldestRecord) {
  const zipUrlDownload = `https://files.vedassistemas.com.br/download-files/${oldestRecord.id}`;
  await FileModel.updateURLDownload(oldestRecord.id, zipUrlDownload);
  await FileModel.updateStatus(oldestRecord.id, 4);
  await FileModel.updateCompletedAt(oldestRecord.id);
  await notifyUser(oldestRecord.id)

}

async function notifyUser(queueId) {
  await axios.get(`https://contabilidadexml.vedassistemas.com.br/notify-user/${queueId}`)
}
