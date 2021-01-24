//An XML Object for Sending request to the 'data.json' file
var xhttp = new XMLHttpRequest();

//onClick listener callback function when the 'calculate' button is clicked
function CountCash() {
  //container for the all the result
  var Result = document.getElementById("Result5");

  //DOM elements to have all the profit values
  var result_success = document.getElementById("result-success");
  var profit_span = document.getElementById("profit");
  var no_of_days = document.getElementById("no-of-days");
  var result_error = document.getElementById("result-error");

  //calculation input values
  var e = document.getElementById("symbol");
  var FR = e.options[e.selectedIndex].value;
  var Money = document.getElementById("money").value;
  var Date1 = document.getElementById("date1").value;
  var Date2 = document.getElementById("date2").value;

  if (Money < 100) {
    //if the result container is not shown, show it
    if (Result.style.display == "") Result.style.display = "block";
    //since the money is less, the calculations will not be attempted
    //and an error message is to be displayed
    result_error.removeAttribute("hidden");
    result_success.hidden = true;
  } else {
    //adding listener to the XHTTP object
    xhttp.onreadystatechange = function () {
      //the following statement will be true when data.json exists
      //and the data is provided as the response
      if (this.readyState == 4 && this.status == 200) {
        //parsing the data received from data.json and storing it in myJSON object
        const myJSON = JSON.parse(this.response);

        //calculating the base money using up for the company and the money
        var base_money = myJSON[FR]["up"] * Money;

        //converting received date string to date objects
        var date_1 = new Date(Date1);
        var date_2 = new Date(Date2);

        //calculating the difference of days between two objects
        var time_difference = date_2.getTime() - date_1.getTime();
        var day_difference = time_difference / (1000 * 3600 * 24);

        //this variable determines how much is the dependency ratio between days and profit money
        var profit_to_date_dependency_ratio = 0.0;

        if (day_difference >= 1 && day_difference < 30) {
          profit_to_date_dependency_ratio = 0.1;
        } else if (day_difference >= 30 && day_difference < 50) {
          profit_to_date_dependency_ratio = 0.2;
        } else if (day_difference >= 50 && day_difference < 75) {
          profit_to_date_dependency_ratio = 0.3;
        } else if (day_difference >= 75 && day_difference < 100) {
          profit_to_date_dependency_ratio = 0.4;
        } else if (day_difference >= 100 && day_difference < 150) {
          profit_to_date_dependency_ratio = 0.45;
        } else if (day_difference >= 150) {
          profit_to_date_dependency_ratio = 0.5;
        } else {
          profit_to_date_dependency_ratio = 0.0;
        }

        var myResult2 =
          base_money * profit_to_date_dependency_ratio * (day_difference / 2);
        myResult2 = myResult2.toFixed(2);

        profit_span.innerHTML = (myResult2 / 60).toFixed(2);
        no_of_days.innerHTML = day_difference;

        if (Result.style.display == "") Result.style.display = "block";
        result_success.removeAttribute("hidden");
        result_error.hidden = true;
      }
    };

    xhttp.open("GET", "./data.json", true);
    xhttp.send();
  }
}
