/* CLIENT SIDE SCRIPT */

console.log('Client.js is working!');

$(document).ready(function(){
  // button listeners
  $('#submitBtn').on('click', createTodo);
  $('#container').on('click', '.deleteBtn', deleteTodo);
  $('#container').on('click', '.checkbox', completedTodo);

  // retrieve data from database
  getData();
}); // end of document ready


// FUNCTIONS
function completedTodo(){
  var completedObject = {};

  if($( this ).prop( "checked" )){
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
      $("#container").children().remove();
      getData();
    }
  });
}

function createTodo(){
  console.log('Submit button was clicked.');
    if($('#todoInput').val() === '' || $('#todoInput').val() === undefined){
        alert('Please enter a todo.');
      } else {
      // this is were we get the users input
      var userInput = {
        todoItem: $('#todoInput').val(),
        todoComplete: false
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

function displayData(data){
  console.log('This is the data to be displayed: ', data);
  console.log(data.length);
  for (var i = 0; i < data.length; i++) {
    if(data[i].completed === true){
      $('#container').append('<div class="listChecked" id="' + data[i].todo + '"><input class="checkbox" type="checkbox" value="' + data[i].todo + '"checked><label class="todoText">' + data[i].todo + '</label><button class="deleteBtn">X</button></div>');
      $('.listChecked').css('background-color', 'rgba(219, 219, 219, 0.6)');
    } else {
      $('#container').append('<div class="list" id="' + data[i].todo + '"><input class="checkbox" type="checkbox" value="' + data[i].todo + '"><label class="todoText">' + data[i].todo + '</label><button class="deleteBtn">X</button></div>');
    }
  } // end of 'for' loop
} // end of displayData function

function getData(){
  // ajax call to server to retrieve data
  $.ajax({
    type: 'GET',
    url: '/todos',
    success: function(response){
      console.log('Back from the server with: ', response);
      // display Data to DOM
      displayData(response);
    } // end of success
  }); // end of ajax GET call
} // end of getData function

function inputToServer(input){
  console.log(input);
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
