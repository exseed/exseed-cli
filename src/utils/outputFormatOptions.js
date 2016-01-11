import fs from 'fs';
import path from 'path';

export default function outputFormatOptions(opts, cb) {
  const outputPath = path.join(opts.dir.target, 'exseed.opts.json');
  const outputContent = JSON.stringify(opts);
  if (!fs.existsSync(opts.dir.target)) {
    fs.mkdir(opts.dir.target, (err) => {
      if (err) {
        cb(err);
      }
      fs.writeFile(outputPath, outputContent, cb);
    });
  } else {
    fs.writeFile(outputPath, outputContent, cb);
  }
}