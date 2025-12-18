const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

const bumpPatch = (version) => {
  const parts = version.split('.').map((v) => parseInt(v, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] += 1;
  return parts.join('.');
};

const pkg = readJson(pkgPath);
const manifest = readJson(manifestPath);

const baseVersion = pkg.version || manifest.version || '0.0.0';
const newVersion = bumpPatch(baseVersion);

pkg.version = newVersion;
manifest.version = newVersion;

writeJson(pkgPath, pkg);
writeJson(manifestPath, manifest);

console.log(`[version] bumped to ${newVersion}`);
