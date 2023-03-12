//when document is ready
var items = new vis.DataSet([
  /* data */
    
]);
var groups = new vis.DataSet([
  /* data */
    
]);
var options = {};

$(document).ready(function () {
  // DOM element where the Timeline will be attached
  var container = document.getElementById("visualization");

  options = {
    //make it centered on today
    start: new Date(new Date().valueOf() - 1000 * 60 * 60 * 24),
    end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
  };

  // Create a Timeline
  var timeline = new vis.Timeline(container, items, groups, options);

  timeline.on("click", function (properties) {
    console.log(properties);
    if(properties.what == "item"){
        //find the item in the items array
        let item = items.get(properties.item);
        console.log(item.childrenShown)
        if(!item.childrenShown){
            showChildren(item);
        } else {
            hideChildren(item);
        }
    }
  });
});

let showChildren = (item) => {
    item.childrenShown = true;
    for(let i = 0; i < item.children.length; i++){
        //add the children to the timeline to the bottom
        items.add(item.children[i]);
    }
    items.update(item);
}

let hideChildren = (item) => {
    item.childrenShown = false;
    for(let i = 0; i < item.children.length; i++){
        //remove the children from the timeline
        hideChildren(item.children[i]);
        items.remove(item.children[i]);
    }
    items.update(item);
}

let addChild = (item, child) => {
    //check if the child is in item bounds
    if(child.start < item.start || child.end > item.end){
        alert("Child is not in the bounds of the parent");
        return;
    }
    item.children.push(child);
    items.update(item);
    //showChildren(item);
}


let addTask = (task) => {
  items.add(task);
};

let addGroup = (group) => {
    groups.add(group);
};

let addButton = () => {
  
    let title = document.getElementById("title").value;
    let start = document.getElementById("start").value;
    let end = document.getElementById("end").value;
    //create a group with the title as the name
    addGroup({id: title, content: title});

    let task = {
        id: items.length + 1,
        group: title,
        content: title,
        start: start,
        end: end,
        children: [],
        childrenShown: false
    };
    addTask(task); 
};

let addChildButton = () => {
    let title = document.getElementById("childTitle").value;
    let start = document.getElementById("childStart").value;
    let end = document.getElementById("childEnd").value;
    let parent = document.getElementById("parentTitle").value;
    //find the parent by the title
    let parentItem = items.get({
        filter: function (item) {
            return item.content == parent;
        }
    });
    parentItem = parentItem[0];
    console.log(parentItem);
    let child = {
        id: parentItem.id + "." + parentItem.children.length,
        group: parentItem.group,
        content: title,
        start: start,
        end: end,
        children: [],
        childrenShown: false
    };
    addChild(parentItem, child);
    items.update(parentItem);
    console.log(parentItem);
    hideChildren(parentItem);
    showChildren(parentItem);
}



