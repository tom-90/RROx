import url from 'url';
import fs from 'fs-extra';
import path from 'path';
import tar from 'tar';
import https from 'https';
import http from 'http';
import gunzip from 'gunzip-maybe';
import LRUCache from 'lru-cache';

import getContentType from './getContentType.js';
import bufferStream from './bufferStream.js';

const npmRegistryURL =
  process.env.NPM_REGISTRY_URL || 'https://rrox-registry.tom90.nl';
const cachePath =
  process.env.NPM_CACHE_DIR ? path.resolve( process.env.NPM_CACHE_DIR ) : path.resolve( __dirname, './cache' );

const httpAgent = new http.Agent({
  keepAlive: true
});
const httpsAgent = new https.Agent({
  keepAlive: true
});

const oneMegabyte = 1024 * 1024;
const oneSecond = 1000;
const oneMinute = oneSecond * 60;

const cache = new LRUCache({
  max: oneMegabyte * 40,
  length: Buffer.byteLength,
  maxAge: oneSecond
});

const notFound = '';

function get(options) {
  return new Promise((accept, reject) => {
    if(options.protocol === 'http:')
      http.get(options, accept).on('error', reject);
    else
      https.get(options, accept).on('error', reject);
  });
}

function isScopedPackageName(packageName) {
  return packageName.startsWith('@');
}

function encodePackageName(packageName) {
  return isScopedPackageName(packageName)
    ? `@${encodeURIComponent(packageName.substring(1))}`
    : encodeURIComponent(packageName);
}

async function fetchPackageInfo(packageName, log) {
  const name = encodePackageName(packageName);
  const infoURL = `${npmRegistryURL}/${name}`;

  log.debug('Fetching package info for %s from %s', packageName, infoURL);

  const { hostname, pathname, protocol, port } = url.parse(infoURL);
  const options = {
    protocol,
    port,
    agent: protocol === 'http:' ? httpAgent : httpsAgent,
    hostname: hostname,
    path: pathname,
    headers: {
      Accept: 'application/json'
    }
  };

  const res = await get(options);

  if (res.statusCode === 200) {
    return bufferStream(res).then(JSON.parse);
  }

  if (res.statusCode === 404) {
    return null;
  }

  const content = (await bufferStream(res)).toString('utf-8');

  log.error(
    'Error fetching info for %s (status: %s)',
    packageName,
    res.statusCode
  );
  log.error(content);

  return null;
}

async function fetchVersionsAndTags(packageName, log) {
  const info = await fetchPackageInfo(packageName, log);
  return info && info.versions
    ? { versions: Object.keys(info.versions), tags: info['dist-tags'] }
    : null;
}

/**
 * Returns an object of available { versions, tags }.
 * Uses a cache to avoid over-fetching from the registry.
 */
export async function getVersionsAndTags(packageName, log) {
  const cacheKey = `versions-${packageName}`;
  const cacheValue = cache.get(cacheKey);

  if (cacheValue != null) {
    return cacheValue === notFound ? null : JSON.parse(cacheValue);
  }

  const value = await fetchVersionsAndTags(packageName, log);

  if (value == null) {
    cache.set(cacheKey, notFound, 5 * oneMinute);
    return null;
  }

  cache.set(cacheKey, JSON.stringify(value), oneMinute);
  return value;
}

// All the keys that sometimes appear in package info
// docs that we don't need. There are probably more.
const packageConfigExcludeKeys = [
  'browserify',
  'bugs',
  'directories',
  'engines',
  'files',
  'homepage',
  'keywords',
  'maintainers',
  'scripts'
];

function cleanPackageConfig(config) {
  return Object.keys(config).reduce((memo, key) => {
    if (!key.startsWith('_') && !packageConfigExcludeKeys.includes(key)) {
      memo[key] = config[key];
    }

    return memo;
  }, {});
}

async function fetchPackageConfig(packageName, version, log) {
  const info = await fetchPackageInfo(packageName, log);
  return info && info.versions && version in info.versions
    ? cleanPackageConfig(info.versions[version])
    : null;
}

/**
 * Returns metadata about a package, mostly the same as package.json.
 * Uses a cache to avoid over-fetching from the registry.
 */
export async function getPackageConfig(packageName, version, log) {
  const cacheKey = `config-${packageName}-${version}`;
  const cacheValue = cache.get(cacheKey);

  if (cacheValue != null) {
    return cacheValue === notFound ? null : JSON.parse(cacheValue);
  }

  const value = await fetchPackageConfig(packageName, version, log);

  if (value == null) {
    cache.set(cacheKey, notFound, 5 * oneMinute);
    return null;
  }

  cache.set(cacheKey, JSON.stringify(value), oneMinute);
  return value;
}

const extractLocks = {};
const packageFiles = {};

/**
 * Returns a stream of the tarball'd contents of the given package.
 */
export async function getPackage(packageName, version, log) {
  const cacheDir = path.resolve( cachePath, `${packageName}`, version );

  if(packageFiles[cacheDir])
    return { directory: cacheDir, files: packageFiles[cacheDir] };

  if(extractLocks[cacheDir]) {
    await extractLocks[cacheDir];

    return { directory: cacheDir, files: packageFiles[cacheDir] };
  }

  extractLocks[cacheDir] = getPackageFiles(packageName, version, log, cacheDir);

  await extractLocks[cacheDir];
  
  delete extractLocks[cacheDir];

  return { directory: cacheDir, files: packageFiles[cacheDir] };
}

async function getPackageFiles(packageName, version, log, cacheDir) {
  const tarballName = isScopedPackageName(packageName)
    ? packageName.split('/')[1]
    : packageName;
  const tarballURL = `${npmRegistryURL}/${packageName}/-/${tarballName}-${version}.tgz`;

  log.debug('Fetching package for %s from %s', packageName, tarballURL);

  const { hostname, pathname, protocol, port } = url.parse(tarballURL);
  const options = {
    protocol,
    port,
    agent: protocol === 'http:' ? httpAgent : httpsAgent,
    hostname: hostname,
    path: pathname
  };

  const res = await get(options);

  if (res.statusCode === 200) {
    await fs.emptyDir(cacheDir);

    const files = [];

    await new Promise((resolve, reject) => {
      res.pipe(gunzip()).pipe(tar.extract({
        cwd: cacheDir,
      })
        .on('entry', (header) => {
          if(header.type === 'File' || header.type === 'file') {
            const entry = {
              path       : header.path,
              contentType: getContentType(header.path),
              size       : header.size,
            };

            files.push(entry);
          }
        })
        .on('finish', resolve)
        .on('error', reject));
    });

    packageFiles[cacheDir] = files;

    return cacheDir
  }

  if (res.statusCode === 404) {
    return null;
  }

  const content = (await bufferStream(res)).toString('utf-8');

  log.error(
    'Error fetching tarball for %s@%s (status: %s)',
    packageName,
    version,
    res.statusCode
  );
  log.error(content);

  return null;
}

function *walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      const p = path.join(dir, file.name);
      const stat = fs.statSync(p);
      yield {
        path       : p,
        contentType: getContentType(p),
        size       : stat.size,
      };
    }
  }
}

function readPackageCache(pkgDir) {
  const versions = fs.readdirSync(pkgDir, { withFileTypes: true });
  for (const version of versions) {
    if (!version.isDirectory())
      continue;
    const versionDir = path.join(pkgDir, version.name);

    const files = [];
    for (const entry of walkSync(versionDir)) {
      files.push({
        path       : path.normalize(path.relative(versionDir, entry.path)).split(path.sep).join('/'),
        contentType: entry.contentType,
        size       : entry.size,
      });
    }
    packageFiles[versionDir] = files;
  }
}

export function initCache() {
  fs.ensureDirSync(cachePath);
  const root = fs.readdirSync(cachePath, { withFileTypes: true });
  for (const file of root) {
    if (!file.isDirectory())
      continue;
    
    if(isScopedPackageName(file.name)) {
      const packages = fs.readdirSync(path.join(cachePath, file.name), { withFileTypes: true });
      for(const pkg of packages) {
        if (!pkg.isDirectory())
          continue;
        readPackageCache(path.join(cachePath, file.name, pkg.name));
      }
    } else {
      readPackageCache(path.join(cachePath, file.name));
    }
  }
}