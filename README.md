# Dotnet Nuget Login Action

[![Tests](https://github.com/sersoft-gmbh/dotnet-nuget-login-action/actions/workflows/tests.yml/badge.svg)](https://github.com/sersoft-gmbh/dotnet-nuget-login-action/actions/workflows/tests.yml)

A GitHub action that logs into a NuGet registry.

## Inputs

### `registry-url`

The URL of the NuGet registry to log in to.

### `registry-name`

The name to use for the registry.
Equivalent to the `--name` parameter of the `nuget sources add` command.

### `username`

The username to use for the login. Use a secret to avoid exposing it in the logs.
Equivalent to the `--username` parameter of the `nuget sources add` command.

### `password`

The password to use for the login. Use a secret to avoid exposing it in the logs.
Equivalent to the `--password` parameter of the `nuget sources add` command.

### `store-password-in-cleartext`

Whether to store the password in cleartext. The cleanup of this action will remove it again.
Equivalent to the `--store-password-in-clear-text` parameter of the `nuget sources add` command.

### `config-file`

The path to the NuGet configuration file. Uses the default config file by default.
Equivalent to the `--configfile` parameter of the `nuget sources add` command.


## Example Usage

```yaml
uses: sersoft-gmbh/dotnet-nuget-login-action@v2
with:
    registry-url: 'https://nuget.example.com/v3/index.json'
    registry-name: example
    username: ${{ secrets.NUGET_USERNAME }}
    password: ${{ secrets.NUGET_PASSWORD }}
```
