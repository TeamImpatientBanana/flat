$(document).ready(function() {

  // Place JavaScript code here...

});

$( "#button" ).click(function() {
  // Remove the error box
  $(".alert-danger").css("display","none");

  $("#buttonContainer").css("display","none");
  $("#form").css("display","block");
});