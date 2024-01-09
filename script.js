function parseQueryString (queryString) {
  var  newQueryString= queryString.replace('?','');
  var parsedString = '';
  console.log(queryString);
  if(queryString.length > 2){
    parsedString = JSON.parse('{"' + decodeURI(newQueryString).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');}
  return parsedString;
}

$(document).ready(function () {
//call the method passing in the query string.
var jsonQuery = parseQueryString(window.location.search);
//if we have a populated json object,
if( jsonQuery ) {
  //if we have name as a json path in the json object and it's populated.
  if(jsonQuery.user){
    //use jquery to load the value into the field
    user = jsonQuery.user;
    $('#user').text(user);
    $.ajax({
      url: "https://api.airtable.com/v0/appGg5u2GZzOHyA2R/tblPaCwFxm31rnHvx/?filterByFormula=ID='"+user+"'",
      type: 'GET',
      headers: {
        'Authorization':'Bearer pat5GXj42NF8T8tbe.9aeec44e7025c631e571d470093b154a432b02213b0b64f3605f70f9f0d79471',
        'Content-Type':'application/json'
      },
      dataType: "json",
    })
    .done(function (data) {
      // stringify data as you have an Object return, otherwise '[object Object]'
      data = JSON.stringify(data);
      //now parseJSON will format the object to a usable state
      var responseData = jQuery.parseJSON(data);
      level = responseData.records[0].fields.Account_level;
      msisdn = responseData.records[0].fields.msisdn;
      name = responseData.records[0].fields.Name;
      $('#level').text(level);
      $('#msisdn').text(msisdn);
      $('#name').text(name);
    });
  }
}
else {
  $('#user').text('No user input (?user=$(user_id))');
}

var formEnter = $('#form-enter');
formEnter.click(function (){
  var issueEnter = $('#issue-enter');
  var issue = issueEnter.val();
  $.ajax({
    url: 'https://hooks.eu.webexconnect.io/events/QOCCB05KAV',
    type: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    dataType: "json",
    data: JSON.stringify({
      "CRM_ID" : user,
      "Ticket_Reason": issue,
      "msisdn": msisdn,
      "name": name,
      "Account_level": level
    })
  })
  .done(function (data) {
    console.log(data)
  });
  var completeMessage = $('#postDiv'); completeMessage.show();
  var postOrder = $('#preDiv'); postOrder.hide();
  });
});
