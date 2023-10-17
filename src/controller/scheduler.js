const { Agenda } = require("agenda");
const moment = require("moment-timezone");
require("moment/locale/es");
const db = require("../firebase/firebase");
const { ref, set } = require("firebase/database");

const agenda = new Agenda({
  db: {
    address:
      "mongodb+srv://camilochafloque:mamacare12345@mamacare.ygvkaea.mongodb.net/?retryWrites=true&w=majority",
    collection: "notifications",
  },
});

async function scheduleNotification(newNotification, userId) {
  newNotification.timestamp = moment().tz("America/Bogota").format("LLL");
  const notificationsRef = ref(
    db,
    "/notificaciones/" + userId + "/" + newNotification.id
  );
  await set(notificationsRef, newNotification);
}

exports.postSchedule = (req, res) => {
  const { data, userId } = req.body;
  const { id, titulo, notas, categoria, fecha, hora, notificationId, alarma } =
    data;
  const date = new Date();
  date.setFullYear(parseInt(fecha.split("-")[0]));
  date.setMonth(parseInt(fecha.split("-")[1]) - 1);
  date.setDate(parseInt(fecha.split("-")[2]));
  date.setHours(parseInt(hora.split(":")[0]));
  date.setMinutes(parseInt(hora.split(":")[1]));
  date.setSeconds(0);
  date.setMinutes(date.getMinutes() - alarma);

  const color = categoria.split(" ")[1];
  let background = "";
  if (color === "actividad") {
    background = "#A5D8B4";
  } else if (color === "cita") {
    background = "#D8B4FF";
  } else if (color === "medicamento") {
    background = "#E1AD6F";
  } else {
    background = "#B4D8E7";
  }

  const scheduledTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;

  const newNotification = {
    id: id,
    notificationId: notificationId,
    title: `Notificación de Agenda: ${titulo}`,
    tipo: categoria.split(" ")[1],
    detalles: notas,
    horario: moment(
      moment(fecha + " " + hora, "YYYY-MM-DD hh:mm").toDate()
    ).format("dddd, MMMM D YYYY, h:mm a"),
    background: background,
  };

  agenda.define(id, async (job) => {
    await scheduleNotification(newNotification, userId);
    job.attrs.nextRunAt = null;
    await job.save();
  });

  (async function () {
    const notify = agenda.create(id);
    await agenda.start();
    await notify
      .repeatEvery(scheduledTime, { timezone: "America/Bogota" })
      .save();
  })();

  res
    .status(201)
    .json({ message: "Notificación creada..." + new Date().toISOString() });
};
