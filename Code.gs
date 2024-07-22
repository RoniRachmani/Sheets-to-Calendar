function scheduleEvents() {
  const calendarId = 'c_78054c6c2b675df429237b46f162ea16b39bb631f67ea58c8e65365d7d816acc@group.calendar.google.com';
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const calendar = CalendarApp.getCalendarById(calendarId);
  
  Logger.log('Calendar: ' + calendar.getName());

  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  Logger.log('Data from sheet: ' + JSON.stringify(data));

  data.forEach((row, index) => {
    const [title, date, startTime, endTime, description] = row;

    Logger.log(`Row ${index + 2}: Title: ${title}, Date: ${date}, Start Time: ${startTime}, End Time: ${endTime}, Description: ${description}`);

    // Convert date to a Date object
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      Logger.log(`Invalid Date at Row ${index + 2}`);
      return;
    }

    // Extract hours and minutes from the date-time objects
    const startHour = new Date(startTime).getHours();
    const startMinute = new Date(startTime).getMinutes();
    const endHour = new Date(endTime).getHours();
    const endMinute = new Date(endTime).getMinutes();

    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
      Logger.log(`Invalid Time at Row ${index + 2}`);
      return;
    }

    // Set the start and end times on the event date
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHour, startMinute);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endHour, endMinute);

    Logger.log(`Start DateTime: ${startDateTime}, End DateTime: ${endDateTime}`);

    // Create the event
    try {
      calendar.createEvent(title, startDateTime, endDateTime, { description });
      Logger.log(`Event created: ${title}`);
    } catch (e) {
      Logger.log(`Failed to create event at Row ${index + 2}: ${e.toString()}`);
    }
  });
}
