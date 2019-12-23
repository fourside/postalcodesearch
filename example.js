const postalCodeSearch = require("./index");

(async() => {
  try {
    const needle = "0790177"
    const res = await postalCodeSearch(needle);
    console.log(res)
  } catch (err) {
    console.log(err)
  }
})();

