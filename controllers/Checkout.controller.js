var paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AVz4c0swAR4iw7z3EyedzzfoaLtOJB49piDMCYKbl7dH5GAfrnCHWNDIOpua8ZdYTCyC0ToBAMs28w21",
  client_secret:
    "EGAGDrgVP7o4jPkLE0GTDKaWRgTyNXQeyplMerpqxZxZ1tgp5mDXGJZw4Pab3NQA6RJdD4gy6RJI6uen",
});
const RequirementCheckout = (req, res) => {
  let total = 0;
  for (let index = 0; index < req.body.length; index++) {
    req.body[index].price *= 1;
    total += req.body[index].price;
  }
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/error",
    },
    transactions: [
      {
        item_list: {
          items: req.body,
        },
        amount: {
          currency: "USD",
          total: total,
        },
        description: "This is the payment description.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === "approval_url")
          res.status(200).send(payment.links[index].href);
      }
    }
  });
};

module.exports = {
  RequirementCheckout,
};
