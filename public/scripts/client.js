/* CLIENT SIDE SCRIPT */

console.log('Client.js is working!');

$(document).ready(function(){
  // button listeners
  $('#submitBtn').on('click', createTodo);
  $('#container').on('click', '.deleteBtn', deleteTodo);
  $('#container').on('click', '.deleteBtnChecked', deleteTodo);
  $('#container').on('click', '.checkbox', completedTodo);
  $('#allCompletedBtn').on('click', checkCompleted);
  $('#allBtn').on('click', deleteAll);

  // retrieve data from database
  getData();
}); // end of document ready

var dataBackFromDatabase = [];

// FUNCTIONS
function checkCompleted() {
  deleteAllCompleted(dataBackFromDatabase);
}

function completedTodo(){
  var completedObject = {};

  if($( this ).prop( "checked" )){
    console.log('checkbox checked');
    completedObject = {
      todoItem: $(this).attr('value'),
      isCompleted: true
    };
    console.log($(this).attr('value'));
  } else {
    completedObject = {
      todoItem: $(this).attr('value'),
      isCompleted: false
    };
  }
  $.ajax({
    type: 'POST',
    url: '/update',
    data: completedObject,
    success: function(response){
      $("#container").empty();
      getData();
    }
  });
}

function createTodo(){
  console.log('Submit button was clicked.');
  var date  = new Date();
    if($('#todoInput').val() === '' || $('#todoInput').val() === undefined){
        alert('Please enter a todo.');
      } else {
      // this is were we get the users input
      var userInput = {
        todoItem: $('#todoInput').val(),
        todoComplete: false,
        todoDate: date
      }; // end of userInput object
      inputToServer(userInput);
      // clear the userInput
      $('#todoInput').val('');
      //clear table data
      $("#container").children().remove();
    }
}

// removes item from list and database
function deleteTodo(){
  var toDelete = confirm("Are you sure you want to delete this item?");
  if(toDelete === true){
    console.log($(this).parent().attr("id"));
    $(this).parent().remove();
    var deleteItem = {
      todoItem: $(this).parent().attr("id"),
    }; // end of userInput object
    $.ajax({
      type: 'DELETE',
      url: '/todos',
      data: deleteItem,
      success: function(response){
        console.log('DELETE, we got a response from the server: ', response);
        //getData();
      } // end of success
    }); // end of ajax
  } // end of if statement
}

function deleteAllCompleted(todosComplete) {
  var toDelete = confirm("Are you sure you want to delete all completed todos?");
  if(toDelete === true){
    $.ajax({
      type: 'DELETE',
      url: '/completeTodos',
      success: function(response){
        console.log(response);
        $("#container").children().remove();
        getData();
      } // end of success
    }); // end of ajax
  } // end of if statement
}

function deleteAll() {
  var toDelete = confirm("Are you sure you want to delete all todos?");
  if(toDelete === true){
    $.ajax({
      type: 'DELETE',
      url: '/allTodos',
      success: function(response){
        console.log(response);
        $("#container").children().remove();
        getData();
      } // end of success
    }); // end of ajax
  } // end of if statement
}

function displayData(data){
  var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  $('#container').empty();
  for (var i = 0; i < data.length; i++) {
    if(data[i].completed === true){
      var completedDiv = '<div class="todoDivComplete" id="' + data[i].todo + '">';
      completedDiv += '<div id="checkboxDiv"><input id="todoCheckbox" class="checkbox" type="checkbox" value="' + data[i].todo + '" checked></div>';
      completedDiv += '<div id="textDiv"><p>' + data[i].todo + '</p></div>';
      completedDiv += '<div id="dateDiv"><p></p></div>';
      completedDiv += '<button id="btnDiv" class="deleteBtn">X</button>';
      completedDiv += '</div>';
      $('#container').append(completedDiv);
      $('.todoDivComplete').addClass('complete');
    } else {
      //add date
      var date = data[i].date;
      var newDate = new Date(date);
      date = newDate.getDate();
      year = newDate.getFullYear();
      month = newDate.getMonth();
      var dateString = monthArray[month] + ' ' + date + ', ' + year;

      var notCompletedDiv = '<div class="todoDiv" id="' + data[i].todo + '">';
      notCompletedDiv += '<div id="checkboxDiv"><input id="todoCheckbox" class="checkbox" type="checkbox" value="' + data[i].todo + '"></div>';
      notCompletedDiv += '<div id="textDiv"><p>' + data[i].todo + '</p></div>';
      notCompletedDiv += '<div id="dateDiv"><p>' + dateString + '</p></div>';
      notCompletedDiv += '<button id="btnDiv" class="deleteBtn">X</button>';
      notCompletedDiv += '</div>';

      $('#container').append(notCompletedDiv);
    } // end of if statement
  } // end of for loop
} // end of displayData function

function getData(){
  // ajax call to server to retrieve data
  $.ajax({
    type: 'GET',
    url: '/todos',
    success: function(response){
      for (var i = 0; i < response.length; i++) {
        dataBackFromDatabase.push(response[i].completed);
      }
      console.log('Data Back From Server: ', dataBackFromDatabase);
      // display Data to DOM
      displayData(response);
    } // end of success
  }); // end of ajax GET call
  dataBackFromDatabase = [];
} // end of getData function

function inputToServer(input){
  console.log('This is our Input: ', input);
  // send userInput to the server
  $.ajax({
    type: 'POST',
    url: '/todos',
    data: input,
    success: function(response){
      console.log('SWEET, we got a response from the server: ', response);
      getData();
    } // end of success
  }); // end of ajax POST call
} // end of inputToServer function
