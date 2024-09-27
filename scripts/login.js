import http from "k6/http";
import { check, sleep } from "k6";

const isNumeric = (value) => /^\d+$/.test(value);

const default_vus = 4000;

const target_vus_env = `${__ENV.TARGET_VUS}`;
const target_vus = isNumeric(target_vus_env)
  ? Number(target_vus_env)
  : default_vus;

export let options = {
  stages: [
    // Ramp-up from 1 to TARGET_VUS virtual users (VUs) in 5s
    { duration: "5s", target: target_vus },

    // Stay at rest on TARGET_VUS VUs for 10docker compose run k6 run /scripts/ewoks.jss
    { duration: "10s", target: target_vus },

    // Ramp-down from TARGET_VUS to 0 VUs for 5s
    { duration: "5s", target: 0 },
  ],
};

export default function () {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJCcmlucWEgQ3liZXIgUmlzayBHcmFwaCIsInN1YiI6InN5c2FkbWluIiwibWZhVmVyaWZpZWQiOmZhbHNlLCJleHAiOjE3Mjc0NTM5MTgsImlhdCI6MTcyNzM2NzUxOH0.WZHKumYK8WySmZNbBOVbOlbYSeqdo2KDdJOffmatJIc";
  const url = "https://qa-11x-staging.brinqa.net/api/auth/login";
  const payload = JSON.stringify({
    username: "sysadmin",
    password: "sysadmin",
  });
  const params = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    tags: { endpoint: "/login" },
  };
  const response = http.post(url, payload, params);
  check(response, { "status is 200": (r) => r.status === 200 });
  sleep(0.3);

  const url2 =
    "https://qa-11x-staging.brinqa.net/api/caasm/vulnerabilities/view/list";
  const params2 = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    tags: { endpoint: "/vulnerabilities" },
  };
  const response2 = http.get(url2, params2);
  check(response2, { "status is 200": (r) => r.status === 200 });
  sleep(0.3);
}
