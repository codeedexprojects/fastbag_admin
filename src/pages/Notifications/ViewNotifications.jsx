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
  Button,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import {
  deleteNotification,
  getNotifications,
  markAllRead,
  markAsRead,
} from "../../services/allApi";
import { Backdrop, CircularProgress } from "@mui/material";


const NotificationPage = () => {
  const [loading, setLoading] = useState(false);

  const [notificationList, setNotificationList] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  // Fetch notifications from the API when the component mounts
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
      prev.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      )
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
    setNotificationList((prev) =>
      prev.map((notification) => ({ ...notification, is_read: true }))
    );
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
      prev.filter((notification) => notification.id !== deleteDialog.id)
    );
    setDeleteDialog({ open: false, id: null });
  } catch (error) {
    console.error("Error deleting notification:", error);
  } finally {
    setLoading(false);
  }
};


  const openDeleteDialog = (id) => {
    setDeleteDialog({ open: true, id });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <Typography variant="h4">Notifications</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleMarkAllAsRead}
          disabled={notificationList.every((notification) => notification.is_read)}
        >
          Mark All as Read
        </Button>
      </Stack>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <List>
          {notificationList.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {notification.notification_type
                        .split("_")
                        .join(" ")
                        .toUpperCase()}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        User: {notification.user.mobile_number}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <Chip
                          label={notification.is_read ? "Read" : "Unread"}
                          color={notification.is_read ? "success" : "default"}
                          size="small"
                        />
                        <Typography variant="caption" sx={{ ml: 2 }}>
                          {notification.created_at}
                        </Typography>
                      </Box>
                    </>
                  }
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {!notification.is_read && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{ marginRight: 1 }}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => openDeleteDialog(notification.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
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
      <Backdrop
  open={loading}
  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
>
  <CircularProgress color="inherit" />
</Backdrop>

    </Box>
  );
};

export default NotificationPage;
