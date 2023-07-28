import request from "supertest";
import app from "../dist/index.js";

describe("get orderData", () => {
  it("should return orderData", async () => {
    const orderId = 200;
    const expectBody = [
      {
        show_id: 99,
        price: 200,
        section: "A",
        seat_row: "A",
        seat_number: 8,
      },
    ];
    const response = await request(app).get(`/api/v1/order?id=${orderId}`);

    expect(response.status).toBe(200);
    expect(response.body.orders).toEqual(expectBody);
  });

  it("should return 400 if orderId is not exist", async () => {
    const orderId = 999;
    const response = await request(app).get(`/api/v1/order?id=${orderId}`);
    const expectMsg = "查無此訂單";

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(expectMsg);
  });
});

describe("check order status", () => {
  it("should return Paid if order is paid", async () => {
    const data = {
      order: {
        address: "taipei",
        email: "XXXXXXXXXXXXXX",
        orderId: 200,
        phone: "0912345678",
        total: 200,
        username: "name",
      },
    };
    const expectMsg = { checkOrder: "Paid" };
    const response = await request(app).post(`/api/v1/checkPaid`).send(data);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectMsg);
  });

  it("should return Reserved if order is not paid,", async () => {
    const data = {
      order: {
        address: "taipei",
        email: "aa@gmail.com",
        orderId: 230,
        phone: "0912345678",
        total: 200,
        username: "name",
      },
    };
    const expectMsg = { checkOrder: "Reserved" };
    const response = await request(app).post(`/api/v1/checkPaid`).send(data);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectMsg);
  });
});

let token;
describe("create order", () => {
  beforeAll(async () => {
    const user = {
      email: "aa@gmail.com",
      password: "aa",
    };
    const response = await request(app).post(`/user/signin`).send(user);
    token = response.body.data.token;
  });

  it("return 401 if user is not login", async () => {
    const data = {
      showId: 100,
      showSeatId: [161],
    };

    const errorMsg = "invalid token";

    const response = await request(app).post(`/api/v1/order`).send(data);

    expect(response.status).toBe(401);
    expect(response.body.errors).toEqual(errorMsg);
  });

  it("return 400 if seat is already reserved", async () => {
    const data = {
      showId: 100,
      showSeatId: [161],
    };

    const errorMsg = "座位已被購買，請重新選擇座位";

    const response = await request(app)
      .post(`/api/v1/order`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data);

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(errorMsg);
  });

  it("return 200 if seat can be reserved", async () => {
    const data = {
      showId: 100,
      showSeatId: [169],
    };

    const response = await request(app)
      .post(`/api/v1/order`)
      .set({
        Authorization: `${token}`,
      })
      .send(data);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("orderId");
  });
});
