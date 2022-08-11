import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
    it("should return a JSON with the status", (done) => {
        request(app).get("/")
            .expect(200, done);
    });
});
