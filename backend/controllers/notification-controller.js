import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ notifications });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Eroare la preluarea notificărilor" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: "Notificarea nu a fost găsită" });
    }
    
    return res.status(200).json({ notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Eroare la actualizarea notificării" });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;
    
    const notification = new Notification({
      user,
      title,
      message,
      type
    });
    
    await notification.save();
    return res.status(201).json({ notification });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Eroare la crearea notificării" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json({ message: "Notificare ștearsă cu succes" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Eroare la ștergerea notificării" });
  }
};

// Funcție utilitară pentru crearea notificărilor (folosită intern)
export const createNotificationForUsers = async (users, title, message, type = 'info') => {
  try {
    const notifications = users.map(userId => ({
      user: userId,
      title,
      message,
      type
    }));
    
    await Notification.insertMany(notifications);
    return true;
  } catch (err) {
    console.error('Eroare la crearea notificărilor:', err);
    return false;
  }
}; 