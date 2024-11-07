// popup.js
//get the reminder message
document.getElementById("save").addEventListener("click", () => {
  //create message variable
  let message = document.getElementById("message").value;
  //save message in local storage to be used elsewhere
  chrome.storage.local.set({ customMessage: message });
  alert("Ok I did it.");
});

function getNextInterval() {
  let now = new Date();
  let nextInterval = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    Math.floor(now.getMinutes() / 10 + 1) * 10,
    0
  );
  return nextInterval;
}

function updateCountdown() {
  // Get the current time
  let now = new Date();

  // Calculate the next 10-minute interval (e.g., 8:10, 8:20, etc.)
  let nextInterval = getNextInterval();

  // Calculate the time difference in milliseconds
  let timeDiff = nextInterval - now;

  // Convert to minutes and seconds
  let minutes = Math.floor(timeDiff / 1000 / 60);
  let seconds = Math.floor((timeDiff / 1000) % 60);

  // Display the countdown
  document.getElementById("countdown").innerText =
    minutes + "m " + seconds + "s";
}
// Update the countdown every second
setInterval(updateCountdown, 1000);

updateCountdown();

// Function to get the time until the next alarm in milliseconds
function getTimeUntilNextAlarm(alarmName) {
  return new Promise((resolve, reject) => {
    chrome.alarms.get(alarmName, (alarm) => {
      if (alarm) {
        const currentTime = Date.now();
        resolve(alarm.scheduledTime - currentTime);
      } else {
        reject(null);
      }
    });
  });
}

//countdown for time till next alarm
async function updateCountdown2() {
  let timeDiff;
  // Calculate the time difference in milliseconds
  timeDiff = await getTimeUntilNextAlarm("Reminder1").catch(
    async () => (timeDiff = await getTimeUntilNextAlarm("Reminder2"))
  );

  if (timeDiff != null && timeDiff > 0) {
    // Convert to minutes and seconds
    let minutes = Math.floor(timeDiff / 1000 / 60);
    let seconds = Math.floor((timeDiff / 1000) % 60);

    // Display the countdown
    document.getElementById("countdown2").innerText =
      minutes + "m " + seconds + "s";
  } else {
    document.getElementById("countdown2").innerText = "No alarm detected";
  }
}

// Update the countdown every second
setInterval(updateCountdown2, 1000);

updateCountdown2();

//creating the alarm
document.getElementById("saveInterval").addEventListener("click", () => {
  //get the input interval value.
  let interval = parseInt(document.getElementById("interval").value);
  //if input interval is a number and is positive
  if (!isNaN(interval) && interval > 0) {
    // Save the interval to storage in an object with property "alarminterval"
    //The function that's in the 2nd argument, that function runs after the data
    //in the 1st argument is stored.
    chrome.storage.local.set({ alarmInterval: interval }, () => {
      // Clear all existing alarms and set a new one
      chrome.alarms.clearAll(() => {
        chrome.alarms.create("Reminder1", { periodInMinutes: interval });
        alert("Interval saved and alarm reset!");
      });
    });
  }
});

document.getElementById("setDefaultInterval").addEventListener("click", () => {
  let timeDiff = getNextInterval() - Date.now();
  let interval = timeDiff / 1000 / 60;
  if (!isNaN(interval) && interval > 0) {
    // Save the interval to storage
    chrome.storage.local.set({ alarmInterval: interval }, () => {
      // Clear existing alarms and set a new one
      chrome.alarms.clearAll(() => {
        chrome.alarms.create("Reminder2", {
          delayInMinutes: interval,
        });
        alert(interval);
      });
    });
  }
});
