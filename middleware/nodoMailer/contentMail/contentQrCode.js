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
  // <img  src="${film.imgFilm} />

  const qrcode = await generateQRcode(data_QR);
  const content = ` <div style="text-align: center; text-transform: uppercase; color: red; text-shadow: transparent;">Tix Movie xin gửi bạn thông tin vé</div>
    <div style="display: flex; gap: 50px;height: 200px;">
    <img  src="https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/2/0/2023_u22_n_o_240x201.png" />
        <div>
            <p>Tên phim : ${film.nameFilm}</p>
            <p>Cụm rạp : ${film.groupName}</p>
            <p>Rạp chiếu : ${film.rapChieu}</p>
            <p>Thời gian : ${film.showDate}</p>
        </div>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
      <img src="${qrcode}">
    </div>`;
  req.sendMail = content;
  next();
};
module.exports = {
  contentQRcode,
};
