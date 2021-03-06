import fs from 'fs';
import path from 'path';

import { FORMAT_OPTION_FILE_NAME } from '../constants';

export default function readFormatOptions(cb) {
  const cwd = process.cwd();
  const readPath = path.join(cwd, FORMAT_OPTION_FILE_NAME);
  const ERR_OPTION_FILE_NOT_FOUND = new Error('Build information not found');
  try {
    const required = require(readPath);
    if (required) {
      cb(null, required);
    } else {
      cb(ERR_OPTION_FILE_NOT_FOUND);
    }
  } catch (e) {
    cb(ERR_OPTION_FILE_NOT_FOUND);
  }
}