import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { getUserNotifications, markNotificationAsRead, deleteNotification } from '../../api-helpers/api-helpers';

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Eroare la preluarea notificărilor:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Actualizăm notificările la fiecare minut
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read) {
        await markNotificationAsRead(notification._id);
        setNotifications(notifications.map(n => 
          n._id === notification._id ? { ...n, read: true } : n
        ));
      }
    } catch (err) {
      console.error('Eroare la marcarea notificării ca citită:', err);
    }
  };

  const handleDelete = async (event, notificationId) => {
    event.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error('Eroare la ștergerea notificării:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'warning':
        return 'warning.main';
      case 'error':
        return 'error.main';
      case 'success':
        return 'success.main';
      default:
        return 'info.main';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        aria-label="arată notificările"
        color="inherit"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            maxHeight: '80vh',
            width: '400px',
            overflow: 'hidden',
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText'
          }}>
            <Typography variant="h6">
              Notificări {unreadCount > 0 && `(${unreadCount})`}
            </Typography>
            {notifications.length > 0 && (
              <Button 
                size="small" 
                color="inherit" 
                onClick={() => setNotifications([])}
                startIcon={<DeleteOutlineIcon />}
              >
                Șterge tot
              </Button>
            )}
          </Box>
          <Divider />
        </Box>
        
        <Box sx={{ 
          maxHeight: 'calc(80vh - 70px)', 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'action.hover',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'primary.main',
            borderRadius: '4px',
          },
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={32} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Nu ai notificări
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification._id}>
                  <ListItem
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      bgcolor: notification.read ? 'inherit' : 'action.hover',
                      borderLeft: 4,
                      borderLeftColor: getNotificationTypeColor(notification.type),
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <Box sx={{ width: '100%', pr: 2 }}>
                      <Box sx={{ mb: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: notification.read ? 'normal' : 'bold',
                            color: 'text.primary'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}
                        >
                          {notification.message}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString('ro-RO')}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDelete(e, notification._id)}
                          sx={{ color: 'text.secondary' }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationsMenu; 