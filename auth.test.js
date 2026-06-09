const { validateLogin } = require("./auth");

describe("Login Validation", () => {

    test("valid email and password", () => {
        expect(
            validateLogin("test@gmail.com", "123456")
        ).toBe(true);
    });

    test("invalid email", () => {
        expect(
            validateLogin("wrong-email", "123456")
        ).toBe(false);
    });

    test("short password", () => {
        expect(
            validateLogin("test@gmail.com", "123")
        ).toBe(false);
    });

    test("empty fields", () => {
        expect(
            validateLogin("", "")
        ).toBe(false);
    });

});