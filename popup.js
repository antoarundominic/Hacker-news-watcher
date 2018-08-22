var $ =jQuery;
chrome.extension.sendMessage({type: "restBadge"});
var watchingItems = JSON.parse(localStorage.getItem("watchingItems"))||[];
var liNode = document.createElement("ol");
liNode.className = "hn-container";
var node = document.createElement("li");
node.className = "item-container";
var titleNode = document.createElement("span");
titleNode.className = "item-title";
var countNode = document.createElement("span");
titleNode.className = "item-count";

function itemTemplate(id, title, count) {
  return "<a class='item-title' target='_self' href='https://news.ycombinator.com/item?id="+id+"'>"+title+"</a> <span class='item-count'>"+count+"</span>"
}

watchingItems.forEach((i) => {
  var url = "https://hacker-news.firebaseio.com/v0/item/"+i.id+".json";
  $.ajax({
      url: url, type: 'get', dataType: 'json',
    }).done(function(response) {
      console.log("response");
      console.log(response)
      var node = document.createElement("li");
      node.className = "item-container";
      node.innerHTML = itemTemplate(i.id, response.title, i.count);
      container = document.querySelector('.hn-container');
      container.appendChild(node);
    });
});
$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});
