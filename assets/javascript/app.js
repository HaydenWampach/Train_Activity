$(document).ready(function(){
    //api information to firebase database
    var firebaseConfig = {
        apiKey: "AIzaSyD6cNGLrNV3vGor5pRlhE9i2F_hgtCEmPw",
        authDomain: "train-schedule-cae6f.firebaseapp.com",
        databaseURL: "https://train-schedule-cae6f.firebaseio.com",
        projectId: "train-schedule-cae6f",
        storageBucket: "train-schedule-cae6f.appspot.com",
        messagingSenderId: "1002567362324",
        appId: "1:1002567362324:web:4d719da1af87c4b232c401",
        measurementId: "G-MCESNCXH0W"
    };
    firebase.initalizeApp(config);
    //declaring database to variable
    var database = firebase.database();

    //declaring submit button variable
    const submit = $('#submit');

    //setting each entry from the user to blank after submit button clicked
    function clearInputs() {
        $(".form-control").val("");
    }

    //setting what happens on submit button
    submit.on('click', function(){
        event.prefentDefault();

        let train = $("trainName").val().trim();
        let destinationLocation = $("destination").val().trim();
        let trainTimeInitial = $("#firstTrainTime").val().trim();
        let timeInterval = $("#frequncy").val().trim()

        //pushing each entry from user into firebase database
        database.ref().push({
            trainName: train,
            destination: destinationLocation,
            trainStart: trainTimeInitial,
            timing: timeInterval,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        clearInputs();
    });

    database.ref().on("child_added", function (childSnapshot) {
        //calculate when next bus will come based off the start time and the current time

        // current time push to DOM
        var tFrequency = childSnapshot.val().timing;

        //Time is 3:30 AM
        var firstTime = "3:30";
        //first time(pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        // current time
        var currentTime = moment().diff(moment(firstTimeConverted), "minutes");

        //time apart remainder
        var tRemainder = diffTime % tFrequency;

        //minute until train
        var tMinutesTillTrain = tFrequency - tRemainder;

        //next train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        //creating a new table row
        var newTrainDb = $("<tr>").addClass("train-row");

        //inputting each variable from db into its related html field
        var colTrainNameDb = $("<td>").text(childSnapshot.val().trainname);
        var colDestinationLocDb = $("<td>").text(childSnapshot.val().destination);
        var colFrequencyDb = $("<td>").text(childSnapshot.val().timing);
        var colNextArrivalDb = $("<td>").text(moment(nestTrain).format("HH:mm"));
        var colMinutesAway = $("<td>").text(tMinutesTillTrain);

        $("#currentMilitaryTime").text(currentTime);

        //entering each variable into the DOM
        $("#table-body").append(
            newTrainDb).append(
                newTrainDb,
                colTrainNameDb,
                colDestinationLocDb,
                colFrequencyDb,
                colNextArrivalDb,
                colMinutesAway);
        
    });
})