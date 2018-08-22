var topics = document.getElementsByClassName('athing');
for (var i = 0, l = topics.length; i < l; i++) {
  var node = document.createElement("div");
  var textnode = document.createTextNode("Watch");         // Create a text node
  node.appendChild(textnode);
  node.className = "watcher-container";
  node.id = topics[i].id;
  topics[i].querySelector("td:last-of-type.title").appendChild(node);
  topics[i].addEventListener("click",
      function(e) {
    chrome.extension.sendMessage({id: e.target.id, type: "follow", text: "Hello from the webpage!" });
  }, false);

}
