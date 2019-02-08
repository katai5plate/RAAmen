module.exports = {
  extends: "airbnb-base",
  env: {
    browser: true,
    jest: true
  },
  rules: {
    "spaced-comment": ["error", "always", { exceptions: [":"] }],
    "no-console": 0,
    "no-alert": 0,
    "func-names": 0,
    "no-use-before-define": 0,
  }
};
