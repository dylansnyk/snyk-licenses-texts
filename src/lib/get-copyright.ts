import * as debugLib from 'debug';
import * as fetch from 'node-fetch';
import * as _ from 'lodash';
import { Dependency } from './types';

const debug = debugLib('snyk-licenses:getCopyrights');

const repoDefs = {
  'maven': 'maven/mavencentral',
  'gradle': 'maven/mavencentral',
  'npm': 'npm/npmjs',
  'yarn': 'npm/npmjs',
  'poetry': 'pypi/pypi',
  'pip': 'pypi/pypi'
}

export async function getCopyrightDataFromDependency (dependency: Dependency): Promise<string[]> {

  const { name, version, packageManager } = dependency
  const repoDef = repoDefs[packageManager]
  let namespace;
  let packageName;

  if (name.split(":").length > 1) {
    namespace = name.split(":")[0]
    packageName = name.split(":")[1]
  } else {
    namespace = '-'
    packageName = name
  }

  const copyright_url = `https://api.clearlydefined.io/definitions/${repoDef}/${namespace}/${packageName}/${version}`

  debug(`dep : ${copyright_url}`)

  try {
    const res = await fetch(copyright_url);

    debug(res.status)

    if (res.status !== 200) {
      return []
    }
    
    const resJson = await res.json();

    const copyrights = []

    if ('files' in resJson) {
      for (let i = 0; i < resJson.files.length; i++) {
        let file = resJson.files[i];
        if ('attributions' in file) {
          file.attributions.forEach((attribution: string) => {
            if (copyrights.indexOf(attribution) === -1) {
              copyrights.push(attribution)
            }
          })
        }
      }
    }

    return copyrights
  } catch (e) {
    debug(`Did not fetch copyright attribution successfully. Error: ${e}`);
    return []
  }
}

