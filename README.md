# Devin Multi-Account Auth for OpenCode and Magpie

This plugin adapts Devin's subscription API for OpenCode and Magpie. It keeps
the Devin request translation and adds the account details Magpie needs to
keep different Devin seats separate.

## Multi-account behavior

- Each successful Devin sign-in carries a stable `accountId` from Devin's
  organization or team identity.
- The provider declares unlimited account slots with `maxAccounts: 0`.
- The API-key method allows another `devin-session-token$...` account to be
  added without replacing the current account.
- Magpie can retry a failed account and route the same `devin/swe-2` model
  through another account.

The plugin does not store tokens in its source or configuration defaults.
Magpie owns credential storage.

## Install

Install the public repository through Magpie:

```sh
magpie plugin add github:sonder-albert/opencode-devin-multi-auth
```

Disable the upstream Devin plugin before enabling this one if both provide
the `devin` provider.

## Add accounts

Use the browser or Devin CLI sign-in method for the first account. Use the
`Devin session token (another account)` method to add another account when
the Magpie account panel offers a key form.

For unlimited provider account routing:

```sh
magpie provider at-once devin 0
```

The gateway tries another account after a retryable upstream failure. Keep
only accounts that are entitled to the model being routed.

## Codex

Point Codex at Magpie and select the shared Devin model:

```toml
model = "devin/swe-2"
openai_base_url = "http://127.0.0.1:3425/backend-api/codex"
```

Magpie's trace endpoint verifies account order and retries:

```sh
curl -sS http://127.0.0.1:3425/v1/magpie/trace
```

## Scope

The request translation is based on
`@magpie-community/opencode-devin-auth`. The multi-account changes stay
small so they can be proposed upstream after validation against the current
Magpie plugin host.
