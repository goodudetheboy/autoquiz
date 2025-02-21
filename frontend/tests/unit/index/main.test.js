import { fieldsToValidate } from "../../../static/scripts/index/validate.js";

test("validate number of fields in fieldsToValidate", () => {
  expect(fieldsToValidate.length).toBe(3);
})
