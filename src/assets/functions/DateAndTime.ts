


//dateandtime
/**
 * Formats a given date string into "d/m/y" and time into "h:mm:ss AM/PM".
 * @param {string} dateString The date string to format (e.g., order.created_at).
 * @returns {{formattedDate: string, formattedTime: string} | null} The formatted date and time, or null if the date is invalid.
 */
const formatDateTime = (dateString) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  // --- Date Formatting (d/m/y) ---
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  // --- Time Formatting (h:mm:ss AM/PM) ---
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12; // The hour '0' becomes '12'

  const formattedTime = `${hour12}:${minutes}:${seconds} ${ampm}`;

  return { formattedDate, formattedTime };
};

export default formatDateTime;