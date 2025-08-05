import { useEffect, useState } from "react";

// The socket should now be passed from the parent component (LoginForm)
// No need to initialize it here again
function NotificationComponent({ socket, userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket || !userId) return; // Don't connect if there's no socket or userId

    // Listen for new notifications from the server
    socket.on("new-notification", (notification) => {
      console.log("New notification:", notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("new-notification");
    };
  }, [socket, userId]);  // Effect depends on socket and userId

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet!</p>
      ) : (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              <strong>{notif.message}</strong>
              <p>{new Date(notif.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationComponent;
