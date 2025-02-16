const request = require("supertest");
const app = require("../app");

describe("IP Lookup API Tests", () => {
  test("Should return provider details for a valid IP", async () => {
    const response = await request(app)
      .post("/lookup")
      .send({
        ips: ["23.79.237.0/24"],
      });

    expect(response.status).toBe(200);
    expect(response.body.results).toMatchObject({
      "23.79.237.0/24": [
        {
          provider: "Akamai",
          subnet: "23.79.237.0/24",
          tags: ["Cloud", "CDN/WAF"],
        },
      ],
    });
  });

  test("Should return error for more than 10 IPs", async () => {
    const response = await request(app)
      .post("/lookup")
      .send({
        ips: Array(11).fill("184.51.33.230"),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Maximum limit is 10 IP addresses per request."
    );
  });

  test("Should return error for invalid input", async () => {
    const response = await request(app)
      .post("/lookup")
      .send({ ips: "invalid-ip" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Required list of IP addresses: invalid-ip"
    );
  });
});
