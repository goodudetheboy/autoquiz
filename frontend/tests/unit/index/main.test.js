import { fieldsToValidate } from "../../../static/scripts/pages/main/validate.js";

test("validate number of fields in fieldsToValidate", () => {
  expect(Object.keys(fieldsToValidate).length).toBe(3);
})
