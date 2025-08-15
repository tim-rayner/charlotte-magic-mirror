let config = {
  address: "0.0.0.0",
  port: 8080,
  ipWhitelist: [],
  language: "en",
  timeFormat: 24,
  units: "metric",

  modules: []
};
if (typeof module !== "undefined") {
  module.exports = config;
}
