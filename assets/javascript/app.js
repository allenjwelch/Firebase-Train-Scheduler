$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAi6Rgg7L5uAG_yFZoAnWkCSYg0v3AnTDI",
    authDomain: "gtbootcamp-train-schedule-aw.firebaseapp.com",
    databaseURL: "https://gtbootcamp-train-schedule-aw.firebaseio.com",
    projectId: "gtbootcamp-train-schedule-aw",
    storageBucket: "gtbootcamp-train-schedule-aw.appspot.com",
    messagingSenderId: "607557941489"
  };
  firebase.initializeApp(config);
  var database = firebase.database(); 

  var train = '';  
  var destination = ''; 
  var trainTime = ''; 
  var freq = ''; 

  var audio = new Audio('../Firebase-Train-Scheduler/assets/imgs/horn.mp3'); 


  // Button to add trains to DB
  $('button').on('click', function() {
    audio.play(); 
    var train = $('#train').val().trim(); 
    var destination = $('#destination').val().trim(); 
    var trainTime = $('#trainTime').val().trim(); 
    var freq = $('#freq').val().trim(); 
    console.log(train, destination, trainTime, freq); 
     
    // create new array for new train info
    var newTrain = {
      train: train,
      destination: destination,
      trainTime: trainTime, 
      freq: freq
    }

    // ,
    //   nextArrival: nextArrival,
    //   minAway: minAway
    ////////////////////////////////////////////////// remove nextArrival and minAway -- should be added to DOM after DB pull
    
    // push new train info to DB
    database.ref().push(newTrain); 

  }); // END button click

  // pull from DB each time a new train is added to DB
  database.ref().on('child_added', function(childSnapshot, prevChildKey) {
    var train = childSnapshot.val().train;
    var destination = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().trainTime;
    var freq= childSnapshot.val().freq;
    console.log(trainTime);

    // Next Arrival & Minutes Away logic

    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // =======================================================================================

    // var format = "HH:mm";  // HH:mm
    // var trainFreq = parseInt(freq * 60); 

    // var currentTime = parseInt(moment().format('X')); 
    //   console.log('currentTime ' + currentTime); 

    // var trainTime = parseInt(moment(trainTime, format).format('X')); 
    //   console.log('trainTime ' + trainTime); 

    // var secondsInDay = 86400; 

    // var nextArrival; 
    // var minAway;

    // // var nextTime = parseInt(moment(trainTime, 'X').add(trainFreq, 'm').format('X')); 
    // //   console.log('nextTime ' + nextTime); 

    // var schedule = []; 
    // var nextDay = trainTime + secondsInDay; 
    //   console.log('nextDay ' + nextDay); 

    // for (i = trainTime; i <= nextDay ; i + trainFreq ) {
    //   schedule.push(moment(i, 'X').format(format)); 
    //   i = i + trainFreq; 
    //   var j = i + trainFreq;        
    //   if (currentTime > i && currentTime < j) {
    //     nextArrival = moment(j, 'X').format('h:mm A'); 
    //     console.log('currentTime ' + moment(currentTime, 'X').format('h:mm A')); 
    //     console.log('nextArrival ' + moment(nextArrival, 'X').format('h:mm A')); 
    //     console.log(schedule); 
    //     var minAway = moment(nextArrival, 'h:mm A').diff(moment(currentTime, 'X'), 'minutes'); // min
    //     console.log(minAway);
    //   }
    // }
    // =======================================================================================



    // create table information from train info
    var tBody = $('.trainSchedule');
    var tRow = $('<tr>');
    var trainTd = $('<td class="train">').text(train);
    var destinationTd = $('<td class="destination">').text(destination);
    // var trainTimeTd = $('<td class="trainTime">').text(trainTime);
    var freqTd = $('<td class="freq">').text(freq);
    var nextArrivalTd = $('<td class="nextArrival">').text(moment(nextTrain).format("hh:mm"));
    var minAwayTd = $('<td>').text(tMinutesTillTrain);

    // add train info from DB to HTML
    tRow.append(trainTd, destinationTd, freqTd, nextArrivalTd, minAwayTd);
    tBody.append(tRow);


  }); // END pull from DB




}); // END document.ready