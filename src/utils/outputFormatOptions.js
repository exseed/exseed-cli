import fs from 'fs';
import path from 'path';
import { FORMAT_OPTION_FILE_NAME } from '../constants';

export default function outputFormatOptions(opts, cb) {
  const outputPath = {
    // for cli
    cli: path.join(opts.dir.root, FORMAT_OPTION_FILE_NAME),
    // for app
    app: path.join(opts.dir.target, FORMAT_OPTION_FILE_NAME),
  };
  const outputContent = JSON.stringify(opts);

  if (!fs.existsSync(opts.dir.target)) {
    fs.mkdirSync(opts.dir.target);
  }
  fs.writeFileSync(outputPath.cli, outputContent);
  fs.writeFileSync(outputPath.app, outputContent);
  cb();
}