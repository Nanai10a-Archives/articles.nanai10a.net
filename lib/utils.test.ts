import { toTitleCase } from "./utils";

test("to be upper on the start of string", () => {
  expect(toTitleCase("string")).toBe("String");
  expect(toTitleCase("a")).toBe("A");
  expect(toTitleCase("012")).toBe("012");
  expect(toTitleCase("")).toBe("");
});
