# Devin Multi-Account Auth for OpenCode and Magpie

This plugin adapts Devin's subscription API for OpenCode and Magpie. It keeps
the Devin request translation and supports Magpie's existing separate account
slots for different Devin sign-ins.

## Multi-account behavior

- Each successful Devin sign-in is stored as its own account. Magpie uses
  Devin's email and, when available, organization name for the account label.
- The session-token method accepts a `devin-session-token$...` token, for
  example one copied from another machine.
- magpie can retry a failed account and route the same `devin/swe-2` model
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

Use the browser method to sign in to another Devin account. It opens a fresh
login instead of silently reusing the current browser session. Use the
`Devin session token` method only when you already have a token from another
machine.
the Magpie account panel offers a key form.

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
