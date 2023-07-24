import http from "k6/http";
import { sleep } from "k6";
import { check } from "k6";

import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
  stages: [
    { duration: "10s", target: 100 },

    { duration: "20s", target: 0 },
  ],
};

const data = {
  data: {
    id: 69,
    randomString: uuidv4(),
  },
};

export default () => {
  const url =
    "https://llibq3igv0.execute-api.ap-northeast-1.amazonaws.com/v1/mes69";
  const payload = JSON.stringify({
    id: 69,
    randomString: uuidv4(),
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, { "status was 200": (r) => r.status == 200 });

  sleep(1);
  //   const req1 = {
  //     method: "POST",
  //     url: "https://llibq3igv0.execute-api.ap-northeast-1.amazonaws.com/v1/mes69",
  //     body: data,
  //     params: {
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     },
  //   };
  //   const req2 = {
  //     method: "POST",
  //     url: "https://8tqvd2l76i.execute-api.ap-northeast-1.amazonaws.com/prod/queue/69",
  //     params: {
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     },
  //   };

  //   const req3 = {
  //     method: "POST",
  //     url: "https://18jihetbil.execute-api.ap-northeast-1.amazonaws.com/prod/seat/69",
  //     body: data,
  //     params: {
  //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     },
  //   };

  //   const responses = http.batch([req1, req2, req3]);

  //   check(responses[0], {
  //     "main page 200": (res) => res.status === 200,
  //   });
};
