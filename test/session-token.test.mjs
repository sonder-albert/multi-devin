import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { DevinAuthPlugin, _internal } from "../index.mjs"

test("session-token sign-in rejects tokens without Devin's prefix", async () => {
  const method = (await DevinAuthPlugin()).auth.methods.find((entry) => entry.type === "api")
  assert.deepEqual(await method.authorize({ token: " wrong-token " }), {
    type: "failed",
    error: "the token starts with devin-session-token$",
  })
})

test("browser sign-in asks for nothing in Magpie", async () => {
  const method = (await DevinAuthPlugin()).auth.methods.find((entry) => entry.label === "Devin (browser, incognito)")
  assert.ok(method)
  assert.equal(method.prompts, undefined)
})

test("browser sign-in has one name everywhere", async () => {
  const source = await readFile(new URL("../index.mjs", import.meta.url), "utf8")
  assert.equal(_internal.BROWSER_LABEL, "Devin (browser, incognito)")
  assert.deepEqual(source.match(/label: "Devin \(browser[^"]*"/g), null)
  assert.equal(source.match(/label: BROWSER_LABEL/g).length, 2)
})

test("browser sign-in asks Devin to show the account chooser", async () => {
  const source = await readFile(new URL("../index.mjs", import.meta.url), "utf8")
  assert.match(source, /prompt: "select_account"/)
  assert.doesNotMatch(source, /prompt: "login"/)
})

test("a macOS browser is run through its own binary, not `open -a`", () => {
  const launch = _internal.browserLaunch("/Applications/Google Chrome.app", "https://example.test/x", {
    platform: "darwin",
    profile: "Profile 2",
  })
  assert.equal(launch.command, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
  assert.deepEqual(launch.args, [
    "--incognito",
    "--no-first-run",
    "--no-default-browser-check",
    "--profile-directory=Profile 2",
    "https://example.test/x",
  ])
})

test("Edge opens an InPrivate window", () => {
  const launch = _internal.browserLaunch("/usr/bin/microsoft-edge", "https://example.test/x", { platform: "linux" })
  assert.equal(launch.command, "/usr/bin/microsoft-edge")
  assert.deepEqual(launch.args.slice(0, 1), ["--inprivate"])
  assert.equal(launch.args.at(-1), "https://example.test/x")
})
