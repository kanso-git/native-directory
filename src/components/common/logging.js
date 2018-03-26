/* eslint no-console: ["error", { allow: ["info", "warn", "error", "log", "debug"] }] */
const ENABLE_LOGGING = false;
const ENABLE_GA_LOGGING = false;
const debug = (m) => {
  if (ENABLE_LOGGING) console.debug(m);
};

const log = (m) => {
  if (ENABLE_LOGGING) console.log(m);
};
const logJson = (m, d) => {
  if (ENABLE_LOGGING) {
    console.log(m);
    console.log(JSON.stringify(d, null, 3));
  }
};

const warn = (m) => {
  console.warn(m);
};

const info = (m) => {
  if (ENABLE_LOGGING) console.info(m);
};
const logGA = (m) => {
  if (ENABLE_GA_LOGGING) console.info(m);
};
const error = (m) => {
  console.error(m);
};

export {
  log,
  logJson,
  debug,
  info,
  warn,
  error,
  logGA,
};
