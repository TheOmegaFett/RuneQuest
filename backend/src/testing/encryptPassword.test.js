/**
 * Test suite for Password Encryption Middleware
 * @module tests/encryptPassword
 * @requires crypto
 * @requires ../middleware/encryptPassword
 */

const crypto = require("crypto");
const { encryptPassword } = require("../middleware/encryptPassword");

describe("Password Encryption Middleware", () => {

  it("should encrypt password when called", async () => {
    crypto.randomBytes = jest.fn().mockReturnValue(Buffer.from("testSalt"));
    crypto.scryptSync = jest
      .fn()
      .mockReturnValue(Buffer.from("encryptedPassword"));

    await encryptPassword.call("testPassword");

    expect(encryptPassword()["salt"]).toBeTruthy();
    expect(encryptPassword()["password"]).not.toBe("testPassword");
  });

});
