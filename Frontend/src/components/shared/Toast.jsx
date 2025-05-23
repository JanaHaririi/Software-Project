import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configures toast notifications for success/error messages
const Toast = () => {
  return (
    <ToastContainer
      position="top-right" // Position at the top-right corner
      autoClose={3000} // Auto-close after 3 seconds
      hideProgressBar={false} // Show progress bar
      newestOnTop // New toasts appear on top
      closeOnClick // Close toast on click
      rtl={false} // Left-to-right layout
      pauseOnFocusLoss // Pause timer when window loses focus
      draggable // Allow dragging to dismiss
      pauseOnHover // Pause timer on hover
      theme="light" // Use light theme for consistency with Tickets Marche style
    />
  );
};

export default Toast;