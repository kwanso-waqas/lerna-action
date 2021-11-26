#!/usr/bin/env node

const { argv } = require('yargs');
const path = require('path');
const mime = require('mime-types');

const runCmd = require('./helpers/runCmd');
const getCmdParams = require('./helpers/getCmdParams');

const S3SyncClient = require('s3-sync-client');

const client = new S3SyncClient({
  region: 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const { TransferMonitor } = S3SyncClient;
const monitor = new TransferMonitor();
monitor.on('progress', (progress) =>
  console.log(
    `Progress: ${progress.count.current}/${progress.count.total} files (${progress.size.current}/${progress.size.total} bytes)`,
  ),
);

try {
  const { env, cdnUrl, version } = getCmdParams(argv);
  runCmd(`NODE_ENV=${env} PUBLIC_URL=${cdnUrl} npm run build`, async () => {
    console.info(`*** Finished build for version ${version}! ***`);
    await client.sync(
      path.resolve(__dirname, '../build'),
      `s3://content.illumidesk.com/lms/${version}`,
      {
        del: true,
        monitor,
        commandInput: {
          ContentType: (syncCommandInput) => {
            if (syncCommandInput.Key.toLowerCase().endsWith('.svg')) {
              return 'image/svg+xml';
            }
            return mime.lookup(syncCommandInput.Key) || 'text/html';
          },
        },
      },
    );
    console.info(`*** S3 sync completed! ***`);
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
