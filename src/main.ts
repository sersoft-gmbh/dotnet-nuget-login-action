import * as core from '@actions/core';
import {getExecOutput} from '@actions/exec';

async function runCmd(cmd: string, ...args: string[]): Promise<string> {
    const output = await getExecOutput(cmd, args.length <= 0 ? undefined : args, {
        silent: !core.isDebug(),
    });
    return output.stdout;
}

async function main() {
    core.startGroup('Validate input');
    const registryUrl = core.getInput('registry-url', {required: true});
    const registryName = core.getInput('registry-name', {required: true});
    const username = core.getInput('username');
    const password = core.getInput('password', {required: !!username});
    const storePasswordInCleartext = core.getBooleanInput('store-password-in-cleartext',
        {required: !!password});
    const configFilePath = core.getInput('config-file');
    core.endGroup();

    await core.group('Add registry', async () => {
        core.saveState('registryName', registryName);
        let args = [
            'nuget',
            'add',
            'source',
            registryUrl,
            '--name',
            registryName,
        ]
        if (username) args.push('--username', username);
        if (password) {
            args.push('--password', password);
            if (storePasswordInCleartext) args.push('--store-password-in-clear-text');
        }
        if (configFilePath) args.push('--configfile', configFilePath);
        await runCmd('dotnet', ...args);
    });
}

async function post() {
    await core.group('Remove registry', async () => {
        const registryName = core.getState('registryName');
        if (registryName)
            await runCmd('dotnet', 'nuget', 'remove', 'source', registryName);
    });
}

try {
    const isPost = !!core.getState('isPost');
    // Mark the next run as post
    if (!isPost) core.saveState('isPost', 'true')
    if (isPost) post().catch((error) => core.setFailed(error.message));
    else main().catch((error) => core.setFailed(error.message));
} catch (error: any) {
    core.setFailed(error.message);
}
