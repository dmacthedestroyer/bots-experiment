import { sayHello } from "./hello";

describe("hello", () => {
  it("greets you by name", () => {
    const expected = "Hello, Greg!";
    const actual = sayHello("Greg");

    expect(expected).toEqual(actual);
  });
});
