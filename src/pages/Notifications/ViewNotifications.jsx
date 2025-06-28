import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/DoneAll";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import {
  deleteNotification,
  getNotifications,
  markAllRead,
  markAsRead,
} from "../../services/allApi";
import { Button } from "flowbite-react";
import { Trash2 } from "lucide-react";

const NotificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotificationList(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      await markAsRead(id);
      setNotificationList((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllRead();
      setNotificationList((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      setLoading(true);
      await deleteNotification(deleteDialog.id);
      setNotificationList((prev) =>
        prev.filter((n) => n.id !== deleteDialog.id)
      );
      setDeleteDialog({ open: false, id: null });
    } catch (error) {
      console.error("Error deleting notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Notifications
        </Typography>
        <Tooltip title="Mark all as read">
          <span>
            <IconButton
              color="primary"
              onClick={handleMarkAllAsRead}
              disabled={notificationList.every((n) => n.is_read)}
            >
              <DoneIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 3,boxShadow: '0 1px 10px rgba(0, 0, 0, 0.19)', }}>
        <List>
          {notificationList.map((n) => (
            <React.Fragment key={n.id}>
              <ListItem alignItems="flex-start" secondaryAction={
                <Stack direction="row" spacing={1}>
                  {!n.is_read && (
                    <Tooltip title="Mark as read">
                      <IconButton
                        onClick={() => handleMarkAsRead(n.id)}
                      >
                        <MarkEmailReadIcon                         color="info"
/>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => setDeleteDialog({ open: true, id: n.id })}
                    >
                      <Trash2 />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }>
                <ListItemAvatar>
                  <Avatar>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight={600}>
                      {n.notification_type.split("_").join(" ").toUpperCase()}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        User: {n.user?.mobile_number}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Typography
  variant="caption"
  sx={{
    px: 1.2,
    py: 0.4,
    borderRadius: '8px',
    fontWeight: 600,
    color: n.is_read ? '#2e7d32' : '#374151',
    backgroundColor: n.is_read ? '#c8e6c9' : '#e5e7eb',
    display: 'inline-block',
    mr: 2,
  }}
>
  {n.is_read ? 'Read' : 'Unread'}
</Typography>

                        <Typography variant="caption" color="text.secondary">
                          {n.created_at}
                        </Typography>
                      </Box>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
      >
        <DialogTitle>Delete Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteNotification}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default NotificationPage;
