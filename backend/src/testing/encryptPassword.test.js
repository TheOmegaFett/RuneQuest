/**
 * Test suite for Password Encryption Middleware
 * @module tests/encryptPassword
 * @requires crypto
 * @requires ../middleware/encryptPassword
 */

const crypto = require("crypto");
const { encryptPassword } = require("../middleware/encryptPassword");

describe("Password Encryption Middleware", () => {
  let mockNext;
  let mockThis;

  beforeEach(() => {
    mockNext = jest.fn();
    mockThis = {
      isModified: jest.fn(),
      password: "testPassword",
      salt: "",
    };
  });

  it("should encrypt password when modified", async () => {
    mockThis.isModified.mockReturnValue(true);
    crypto.randomBytes = jest.fn().mockReturnValue(Buffer.from("testSalt"));
    crypto.scryptSync = jest
      .fn()
      .mockReturnValue(Buffer.from("encryptedPassword"));

    await encryptPassword.call(mockThis, mockNext);

    expect(mockThis.salt).toBeTruthy();
    expect(mockThis.password).not.toBe("testPassword");
    expect(mockNext).toHaveBeenCalled();
  });

  it("should skip encryption when password not modified", async () => {
    mockThis.isModified.mockReturnValue(false);

    await encryptPassword.call(mockThis, mockNext);

    expect(mockThis.password).toBe("testPassword");
    expect(mockNext).toHaveBeenCalled();
  });
});
