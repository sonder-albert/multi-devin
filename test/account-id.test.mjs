import test from "node:test"
import assert from "node:assert/strict"
import { _internal } from "../index.mjs"

test("uses organization identity to separate Devin seats", () => {
  assert.equal(_internal.accountIdOf({ user: "same@example.com", orgId: "org-a", teamId: "team-a" }), "org-a")
  assert.equal(_internal.accountIdOf({ user: "same@example.com", teamId: "team-b" }), "team-b")
  assert.equal(_internal.accountIdOf({ user: "other@example.com" }), "other@example.com")
  assert.equal(_internal.accountIdOf({}), "Devin")
})
