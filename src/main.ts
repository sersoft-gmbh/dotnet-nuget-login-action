import * as core from "@actions/core";
import {exec} from "@actions/exec";

async function runCmd(cmd: string, ...args: string[]): Promise<void> {
  await exec(cmd, args.length <= 0 ? undefined : args, {silent: !core.isDebug()});
}

async function main() {
  core.startGroup('Validate input');
  const update = core.getBooleanInput('update', {required: true});
  const registryName = core.getInput('registry-name', {required: true});
  const registryUrl = core.getInput('registry-url', {required: !update});
  const protocolVersion = core.getInput('protocol-version');
  const username = core.getInput('username');
  const password = core.getInput('password', {required: !!username});
  const storePasswordInCleartext = core.getBooleanInput('store-password-in-cleartext',
    {required: !!password});
  const configFilePath = core.getInput('config-file');
  if (!username && password) throw new Error('Password cannot be set without username');
  core.endGroup();

  core.saveState('postStepNeeded', !update || (username || password) ? 'true' : 'false');
  core.saveState('update', update ? 'true' : 'false');
  core.saveState('registryName', registryName);
  if (configFilePath) core.saveState('configFilePath', configFilePath);

  await core.group(`${update ? 'Update' : 'Add'} registry`, async () => {
    let args = ['nuget'];
    if (update) {
      args.push('update', 'source', registryName);
      if (registryUrl) args.push('--source', registryUrl);
    } else {
      args.push('add', 'source', registryUrl, '--name', registryName);
    }
    if (username) args.push('--username', username);
    if (password) {
      args.push('--password', password);
      if (storePasswordInCleartext) args.push('--store-password-in-clear-text');
    }
    if (protocolVersion) args.push('--protocol-version', protocolVersion);
    if (configFilePath) // noinspection SpellCheckingInspection
      args.push('--configfile', configFilePath);
    await runCmd('dotnet', ...args);
  });
}

async function post() {
  const postStepNeeded = core.getState('postStepNeeded') === 'true';
  if (!postStepNeeded) return;
  const update = core.getState('update') === 'true';
  await core.group(`Remove registry${update ? ' credentials' : ''}`, async () => {
    const registryName = core.getState('registryName');
    if (registryName) {
      const configFilePath = core.getState('configFilePath');
      let args = ['nuget'];
      if (update)
        args.push('update', 'source', registryName, '--store-password-in-clear-text', '--username', '', '--password', '');
      else
        args.push('remove', 'source', registryName);
      if (configFilePath) // noinspection SpellCheckingInspection
        args.push('--configfile', configFilePath);
      await runCmd('dotnet', ...args);
    }
  });
}

try {
  const isPost = !!core.getState('isPost');
  // Mark the next run as post
  if (!isPost) core.saveState('isPost', 'true');
  (isPost ? post() : main()).catch((error) => core.setFailed(error.message));
} catch (error: any) {
  core.setFailed(error.message);
}
