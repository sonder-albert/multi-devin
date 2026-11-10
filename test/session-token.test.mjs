import test from "node:test"
import assert from "node:assert/strict"
import { DevinAuthPlugin } from "../index.mjs"

test("session-token sign-in rejects tokens without Devin's prefix", async () => {
  const method = (await DevinAuthPlugin()).auth.methods.find((entry) => entry.type === "api")
  assert.deepEqual(await method.authorize({ token: " wrong-token " }), {
    type: "failed",
    error: "the token starts with devin-session-token$",
  })
})
