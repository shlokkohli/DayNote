export function getFormattedDate() {
    const currentDate = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
    const formattedDate = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}`;
  
    return formattedDate;
}