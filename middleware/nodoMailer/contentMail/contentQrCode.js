const { generateQRcode } = require("../../QRCode");

const contentQRcode = async (req, res, next) => {
  const { film, user, listTicket, idShowTime } = req.body;
  const data_QR = {
    email: user.email,
    showdate: film.showDate,
    film: film.nameFilm,
    idshowtime: idShowTime,
    listTicket,
  };
  //

  const qrcode = await generateQRcode(data_QR);
  const content = `<div style="text-align: center; text-transform: uppercase; color: #ff6f61; font-size: 30px; font-weight: bold; margin-bottom: 25px; font-family: Arial, sans-serif;">
    🎬 Beta Movie xin gửi bạn thông tin vé 🎫
</div>
<div style="border: 1px solid #e0e0e0; padding: 35px; border-radius: 20px; background: linear-gradient(135deg, #ffffff, #f1f1f1); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
    <div style="display: flex; justify-content: space-between; gap: 40px;">
        <!-- Thông tin phim -->
        <div style="flex: 1; color: #333; font-size: 18px; line-height: 1.8; font-family: 'Roboto', sans-serif;">
            <p><strong>Tên phim:</strong> ${film.nameFilm}</p>
            <p><strong>Cụm rạp:</strong> ${film.groupName}</p>
            <p><strong>Rạp chiếu:</strong> ${film.rapChieu}</p>
            <p><strong>Thời gian:</strong> ${film.showDate}</p>
        </div>

        <!-- QR Code -->
        <div style="flex: 1; text-align: center;">
            <div style="border: 2px solid #ff6f61; border-radius: 15px; padding: 15px; background-color: #ffffff; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);">
                <img src="${qrcode}" alt="QR Code" style="width: 160px; height: 160px; border-radius: 10px;">
            </div>
        </div>
    </div>
</div>

`;
  req.sendMail = content;
  next();
};
module.exports = {
  contentQRcode,
};
