var paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AVz4c0swAR4iw7z3EyedzzfoaLtOJB49piDMCYKbl7dH5GAfrnCHWNDIOpua8ZdYTCyC0ToBAMs28w21",
  client_secret:
    "EGAGDrgVP7o4jPkLE0GTDKaWRgTyNXQeyplMerpqxZxZ1tgp5mDXGJZw4Pab3NQA6RJdD4gy6RJI6uen",
});

const RequirementCheckout = (req, res) => {
  // Danh sách các mục cần thanh toán
  let items = [];

  // Tổng tiền thanh toán
  let total = 0;

  // Duyệt qua tất cả các mục trong req.body
  req.body.forEach((item) => {
    // Chuyển đổi price thành số và kiểm tra tính hợp lệ
    const price = parseFloat(item.price);
    if (isNaN(price)) {
      return res
        .status(400)
        .json({ error: `Invalid price for item: ${item.name}` });
    }

    items.push({
      name:
        item.sku === "ticket"
          ? `Ticket for seat ${item.name}`
          : `Combo: ${item.name}`,
      price: price.toFixed(2),
      currency: item.currency || "USD",
      quantity: item.quantity,
    });
    total += price * item.quantity;
  });

  // Cấu hình yêu cầu thanh toán
  const create_payment_json = {
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
          items: items,
        },
        amount: {
          currency: "USD",
          total: total.toFixed(2),
        },
        description: "Payment for tickets and combos.",
      },
    ],
  };

  // Tạo thanh toán PayPal
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      // Gửi URL phê duyệt của PayPal cho phía frontend
      for (let index = 0; index < payment.links.length; index++) {
        if (payment.links[index].rel === "approval_url") {
          return res.status(200).send(payment.links[index].href);
        }
      }
    }
  });
};

module.exports = {
  RequirementCheckout,
};
