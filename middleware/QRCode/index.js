var QRCode = require("qrcode");
const generateQRcode = async (detail) => {
  const data_qr = {
    email: detail.email,
    showdate: detail.showdate,
    film: detail.film,
    idshowtime: detail.idshowtime,
    listTicket: detail.listTicket,
  };
  let QrCode_img = await QRCode.toDataURL(JSON.stringify(data_qr));
  return QrCode_img;
};

module.exports = {
  generateQRcode,
};
