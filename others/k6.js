import http from "k6/http";
import { sleep, check } from "k6";
import { Counter } from "k6/metrics";

import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  stages: [{ duration: "5s", target: 5000 }],
};

const id = 69;
let req1Count = new Counter("req1");
let req2Count = new Counter("req2");
let req3Count = new Counter("req3");

export default () => {
  const data = {
    data: {
      id,
      randomString: uuidv4(),
    },
  };

  const req1 = {
    method: "POST",
    url: `https://ssub96p2v2.execute-api.ap-northeast-1.amazonaws.com/v1/mes${id}`,
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  const req2 = {
    method: "POST",
    url: `https://18jihetbil.execute-api.ap-northeast-1.amazonaws.com/prod/seat/${id}`,
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };

  const req3 = {
    method: "POST",
    url: `https://yzuhyu.com/api/v1/order`,
    body: JSON.stringify({
      showSeatId: [108],
      showId: id,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWEiLCJlbWFpbCI6ImFhQGdtYWlsLmNvbSIsImlhdCI6MTY4OTk5NDc3OSwiZXhwIjoxNjkwMjEwNzc5fQ.UZV5t93MRjAzIf_fK7TXztdACyRxlHh8bWJwuguzDm4`,
    },
  };

  const response = http.post(req1.url, req1.body, req1.headers);
  //console.log(response.body);
  check(response, { "status was 200": (r) => r.status == 200 });
  req1Count.add(1);

  let value = 0;
  while (value === 0) {
    sleep(1);
    const response2 = http.post(req2.url, req2.body, req2.headers);
    console.log(response2.body);
    check(response2, { "status was 200": (r) => r.status == 200 });
    const data = JSON.parse(response2.body);
    value = data.data.checkKey;
    req2Count.add(1);
  }

  const response3 = http.post(req3.url, req3.body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoiYWEiLCJlbWFpbCI6ImFhQGdtYWlsLmNvbSIsImlhdCI6MTY4OTk5NDc3OSwiZXhwIjoxNjkwMjEwNzc5fQ.UZV5t93MRjAzIf_fK7TXztdACyRxlHh8bWJwuguzDm4`,
    },
  });
  check(response3, {
    "status was 200": (r) =>
      r.status == 200 || r.status == 400 || r.status == 401,
  });
  req3Count.add(1);
  sleep(1);
};
