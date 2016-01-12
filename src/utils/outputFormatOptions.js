import fs from 'fs';
import path from 'path';

const FILE_NAME = 'exseed.opts.json';

export default function outputFormatOptions(opts, cb) {
  const outputPath = {
    // for cli
    cli: path.join(opts.dir.root, FILE_NAME),
    // for app
    app: path.join(opts.dir.target, FILE_NAME),
  };
  const outputContent = JSON.stringify(opts);

  if (!fs.existsSync(opts.dir.target)) {
    fs.mkdirSync(opts.dir.target);
  }
  fs.writeFileSync(outputPath.cli, outputContent);
  fs.writeFileSync(outputPath.app, outputContent);
  cb();
}