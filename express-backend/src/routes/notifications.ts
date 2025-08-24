import express from 'express';
import Notification from '../models/Notification';

const router = express.Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Get user notifications
router.get('/:userId', requireAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.params.userId })
      .sort({ created_at: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/:notificationId/read', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read for user
router.put('/user/:userId/read-all', requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.params.userId, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Get unread notification count
router.get('/:userId/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user_id: req.params.userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

export default router;