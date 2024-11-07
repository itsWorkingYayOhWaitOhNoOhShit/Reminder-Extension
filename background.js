// background.js

  
  // When the alarm is triggered, show the notification
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "Reminder1") {
      //get the custom message from storage
      chrome.storage.local.get("customMessage", (data) => {
        let message = data.customMessage || "This is your reminder!";
        //create chrome notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Reminder",
          message: message,
        });
      });
    } else if (alarm.name === "Reminder2") {
      //get the custom message from storage
      chrome.storage.local.get("customMessage", (data) => {
        let message = data.customMessage || "This is your reminder!";
        //create chrome notification
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Reminder",
          message: message,
        });
      });
      chrome.alarms.clearAll(() => {
        chrome.alarms.create("Reminder1", { periodInMinutes: 10 });
        alert("Changed to Reminder1");
      });
    }
  });