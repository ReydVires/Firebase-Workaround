const firebaseRef = firebase.database();

function pushIncrementData(){
	var idField = document.getElementById('idF').value;
	var nameField = document.getElementById('textF').value;
	var scoreField = document.getElementById('scoreF').value;
	
	if ((idField.length != 0) && (nameField.length != 0) && (scoreField.length != 0)){
		submitData(idField, nameField, scoreField);
		
		firebase.database()
		.ref('/users/totalUser/')
		.transaction(function(snapshot) {
			//for (var key in snapshot.val()) {
			//	for (var item of snapshot.val()[key]['id']) {
			//		console.log(item.id);
			//	}
			//}
			return snapshot + 1;
		});		
	}
	else{
		console.log("Incomplete data");
	}
}

function submitData(uid, uname, uscore){
	var len;
	firebase.database()
	.ref('/users/flappy-serina/')
	.once('value')
	.then(function(snapshot) {
		len = snapshot.val().length;
		firebaseRef.ref('users/flappy-serina/' + len).set({
			id: uid,
			name: uname,
			score: parseInt(uscore)
		});
	});
	
	//firebaseRef.ref('testing_db').push(dataArr);﻿
	console.log("submit");
}

function reqTotalUser(){
	var val = 0;
	firebaseRef.ref("users/totalUser/")
	.on("value", function(snapshot) {
	  val = snapshot.val();
	  console.log('Total data user: ' + val);
	});
}

function deleteData(){
	var userId = 2;
	firebaseRef.ref("users/flappy-serina/" + userId).set(null);
	
	firebase.database()
	.ref('/users/totalUser/')
	.transaction(function(snapshot) {
		return snapshot - 1;
	});
}

function updateData(index){
	var idField = document.getElementById('idF').value;
	var nameField = document.getElementById('textF').value;
	var scoreField = document.getElementById('scoreF').value;
	
	var updateRef = firebaseRef.ref("users/flappy-serina/" + index);
    updateRef.transaction( () => {
		return {
			id: idField,
			name: nameField,
			score: parseInt(scoreField)
		}
    });
	console.log("updateData");
}

function retrieveLeaderboard(){
	console.log("retrieveLeaderboard");
	var sum = 0;
	var max;
	var name;
	var list;
	var snapId;
	firebase.database()
	.ref('/users/flappy-serina/')
	.once('value')
	.then(function(snapshot) {
		//for (var key in snapshot.val()) {
		//	for (var item of snapshot.val()[key]['id']) {
		//		console.log(item.id);
		//	}
		//}
		//console.log(snapshot.val());
		list = snapshot.val();
		max = snapshot.val()[0]["score"]
		for (var i = 1; i < snapshot.val().length; i++){
			//console.log(snapshot.val()[i]["id"]);
			sum += parseInt(snapshot.val()[i]["score"]);
			if (snapshot.val()[i]["score"] > max){
				max = snapshot.val()[i]["score"];
				snapId = snapshot.val()[i]["id"];
				name = snapshot.val()[i]["name"];
			}
		}
		console.log("Max: " + max + " with id: " + snapId + " name: " + name);
		console.log("Total: " + sum);
		
		getLeaderboard(insertionSort(list), 3);
	});
	
	reqTotalUser()
}

function changeData() {
	var uid = document.getElementById('idF').value;
	var isFound = false;
	
	var ref = firebaseRef.ref("users/flappy-serina/");
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      /**if (data) {
		window.alert("pass");
        if (data.name) {
          console.log(data.name);
        } else {
		  console.log(data);
        }
      } else {
        window.alert("Failed");
      }
	  **/
	  // Iterate for searching first
	  for (var index in data){
		  console.log("index: " + index + "; id: " + data[index]["id"]);
		  console.log("name: " + data[index]["name"]);
		  console.log("score: " + data[index]["score"]);
		  
		  if (!isFound && data[index]["id"] == uid){
			  isFound = true;
			  updateData(index);
		  }
	  }
	  
	  if (isFound){
		  window.alert("Data found! Now changed!");
	  }
	  else {
		  window.alert("Data not found!");
	  }
    });
 }
 
 function getLeaderboard(list, listLeader){
	 console.log("get Leaderboard: " + listLeader + " person");
	 var len = list.length;
	 if (len > listLeader){
		 len = listLeader;
	 }
	 for (var i = 0; i < len; i++){
		 console.log(list[i]["id"]);
		 console.log(list[i]["name"]);
		 console.log(list[i]["score"]);
		 
	 }
 }

function insertionSort(items) {
	console.log("do insertionSort");
	let value = {}
	for (var i = 0; i < items.length; i++) {
		value.score = items[i]["score"];
		value.id = items[i]["id"];
		value.name = items[i]["name"];
		// store the current item value so it can be placed right
		for (var j = i - 1; j > -1 && items[j]["score"] < value.score; j--) {
		  // loop through the items in the sorted array (the items from the current to the beginning)
		  // copy each item to the next one
		  items[j + 1]["score"] = items[j]["score"];
		  items[j + 1]["id"] = items[j]["id"];
		  items[j + 1]["name"] = items[j]["name"];
		}
		// the last item we've reached should now hold the value of the currently sorted item
		items[j + 1]["score"] = value.score;
		items[j + 1]["name"] = value.name;
		items[j + 1]["id"] = value.id;
	}
	return items;
}