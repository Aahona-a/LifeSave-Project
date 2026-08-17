const Notification = require('../models/notificationModel');
async function notify(userId, title, message, type = 'info', connection = null) {
  return Notification.create({ userId, title, message, type }, connection);
}
module.exports = { notify };
