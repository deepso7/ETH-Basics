const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
const INITIAL_STRING = "Hi there!";

beforeEach(async () => {
  try {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy our contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
      .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
      .send({ from: accounts[0], gas: "1000000" });
  } catch (err) {
    console.log(err);
  }
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });

  it("has a defalut message", async () => {
    console.log(inbox.methods);
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, INITIAL_STRING);
  });

  it("can change message", async () => {
    await inbox.methods.setMessage("Bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, "Bye");
  });
});
