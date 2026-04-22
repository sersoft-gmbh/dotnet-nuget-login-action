# Dotnet Nuget Login Action

[![Tests](https://github.com/sersoft-gmbh/dotnet-nuget-login-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/dotnet-nuget-login-action/actions/workflows/tests.yml)

A GitHub action that logs into a NuGet registry.

## Inputs

### `update`

Whether to update an existing registry instead of adding a new one. Default is `false`.
If set to `true`, the `nuget sources update` command is used. Otherwise `nuget sources add` is used. 
Note that the action will set the credentials to empty values in the post-step (instead of removing the source) when `update` is `true.

### `registry-name`

The name to use for the registry.
Equivalent to the `--name` parameter of the `nuget sources add` command or the first positional argument of `nuget sources update`.

### `registry-url`

The URL of the NuGet registry to log in to. Not required if `update` is used.
If `update` is `true`, this is the passed as the `--source` parameter of the `nuget sources update` command.

### `protocol-version`

The protocol version to use for the registry.
Equivalent to the `--protocol-version` parameter of the `nuget sources add` / `nuget sources update` command.

### `username`

The username to use for the login. Use a secret to avoid exposing it in the logs.
You can also use an environment variable placeholder (e.g. `%NUGET_USERNAME%`) and provide it as environment variable (e.g. `NUGET_USERNAME`) in the rest of the workflow.
Equivalent to the `--username` parameter of the `nuget sources add` / `nuget sources update` command.

### `password`

The password to use for the login. Use a secret to avoid exposing it in the logs.
You can also use an environment variable placeholder (e.g. `%NUGET_PASSWORD%`) and provide it as environment variable (e.g. `NUGET_PASSWORD`) in the rest of the workflow.
Equivalent to the `--password` parameter of the `nuget sources add` / `nuget sources update` command.

### `store-password-in-cleartext`

Whether to store the password in cleartext. The cleanup of this action will remove / replace it again.
Equivalent to the `--store-password-in-clear-text` parameter of the `nuget sources add` / `nuget sources update` command.

### `config-file`

The path to the NuGet configuration file. Uses the default config file by default.
Equivalent to the `--configfile` parameter of the `nuget sources add` / `nuget sources update` command.


## Example Usage

```yaml
uses: sersoft-gmbh/dotnet-nuget-login-action@v2
with:
    update: false
    registry-name: example
    registry-url: 'https://nuget.example.com/v3/index.json'
    protocol-version: 3
    username: ${{ secrets.NUGET_USERNAME }}
    password: ${{ secrets.NUGET_PASSWORD }}
```
