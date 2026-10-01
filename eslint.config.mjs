import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**", "scripts/**"] },
];

export default config;
