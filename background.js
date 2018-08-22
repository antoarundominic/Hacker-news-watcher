
var pollInterval = 1000 * 60 * 5; // 5 minute, in milliseconds
var timerId;
var badgeCount=0;

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Content script received: " + request);
  console.log(request);
  if(request.type == 'follow') { setwatchingItems(request.id); }
  if(request.type == 'restBadge') { badgeCount=0; sendToAction(badgeCount); }
});

function setwatchingItems(itemId) {
  var watchingItems = JSON.parse(localStorage.getItem("watchingItems"))||[];
  watchingItems.push({id: parseInt(itemId, 10), count: 0});
  localStorage.setItem("watchingItems", JSON.stringify(watchingItems));
}

startRequest();
function startRequest() {
	pingHN();
	timerId = window.setTimeout(startRequest, pollInterval);
}

function stopRequest() {
	window.clearTimeout(timerId);
}

function pingHN() {
  $.ajax({
      url: 'https://hacker-news.firebaseio.com/v0/updates.json',
      type: 'get',
      dataType: 'json',
    }).done(function(response) { checkForUpdatedItems(response.items); });
}
function checkForUpdatedItems(updatedItems) {
  var watchingItems = JSON.parse(localStorage.getItem("watchingItems"))||[];
  if(updatedItems.length > 0) {
    watchingItems.forEach((i) => {
      if(updatedItems.includes(i.id)) {
        i.count = i.count + 1;
        badgeCount++;
      }
    });
    localStorage.setItem("watchingItems", JSON.stringify(watchingItems));
    if(badgeCount > 0) {
      sendToAction(badgeCount);
    }
  }
}

function sendToAction(badgeCount) {
  console.log("sending message...  UPDATE_BADGE => ", badgeCount);
  var badgeText = (badgeCount > 0) ? ''+badgeCount : '';
  chrome.browserAction.setBadgeText({text: badgeText});
  chrome.extension.sendMessage({type: "UPDATE_BADGE"});
}

console.log("Content script received: ");
