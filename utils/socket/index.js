const { Server } = require("socket.io");
const { Seats, Rooms, Users, sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

const io = new Server();
const Socket = {
  emit: function (event, data) {
    io.sockets.emit(event, data);
  },
  leave: function (event) {
    io.sockets.socketsLeave(event);
  },
  toEmit: function (event, data) {
    io.sockets.to(event).emit("connectRoom", data);
  },
  on: function (event, data) {
    io.sockets.on(event, data);
  },
};

io.on("connection", function (socket) {
  //! join room
  socket.on("join-room", (data) => {
    const { room, user } = data;
    socket.join(room);
  });
  //! leave room
  socket.on("leaveRroom", async (data) => {
    const { room, user, seats } = data;
    let ids = [];
    seats.forEach((element) => {
      ids.push(element.id);
    });
    await Seats.update(
      { keepSeat: null },
      {
        where: {
          id: ids,
        },
      }
    );
    socket.leave(room);
    socket.broadcast.to(room).emit("receive-order-seat", seats);
  });
  //! choice seat
  socket.on("choice-seat", async (data) => {
    const { room, seat, user } = data;
    const _seat = await Seats.findOne({ where: { id: seat.id } });
    if (_seat.keepSeat) {
      _seat.keepSeat = null;
    } else {
      _seat.keepSeat = user.id;
    }
    await _seat.save();
    socket.broadcast.to(room).emit("receive-order-seat", _seat);
  });
  socket.on("orderTicket_success", (data) => {
    console.log("---------------------------------------------data", data);
    const { room } = data;
    socket.broadcast.to(room).emit("receive-order-seat", room);
  });
});

module.exports = {
  Socket,
  io,
};
