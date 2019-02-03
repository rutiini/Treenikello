import { ContextInstance } from "../AppContext";

test("AppState initalized",
 () => {
  expect(ContextInstance.state).toBeDefined();
});

test("AppDispatch initalized",
 () => {
  expect(ContextInstance.dispatch).toBeDefined();
})