import express from "express";
import  request from "supertest"
import { login } from "../controllers/auth.js";





const app = express();
app.post("/api/users/login", login);

describe("test login controllers", async () => {
    beforeAll(() => (app.listen(3000)))
    
    test("login return object with token", async () => {
        const response = await request(app).post("/api/users/login");
        express(response.status).toBe(200);
})})

// !!!!!
// const buggyCalc = (a, b) => (a + b === 9 ? 10 : a + b);

// describe("test login controllers", () => {
//     test("test calc 1+1=2", () => {
//         expect(buggyCalc(1, 1)).toBe(2);
//   })  
// })
// *****
// post -> 200
// post -> token
// post -> {
//     email(typeof "string")
//     subscription(typeof "string")
// }
// ******

// describe("test login controllers", () => {
//     it("should returns status 200", () => {
        
//     })
// })