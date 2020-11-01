  $(document).ready(function() {  
  var count = 50;
  var contacts = [];
  for (i = 0; i < count; i++) {
    $.ajax({
      url: 'https://randomuser.me/api/',
      dataType: 'json',
      success: function(data){
        console.log(data);
        MakeContactCard(data);
      }
    });
  }
  //console.log(contacts); 
});

function MakeContactCard(data){
  //console.log(data.results[0].user);
  var phone = (data.results[0].phone);
  phone = phone.replace(/-/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/ /g, "");
  var cardHTML = '<div class="contact-card" phone-data="'+phone+'">'
  cardHTML+='<div class="contact-image-wrapper"><img src="'+ data.results[0].picture.large +'"/></div>';
  cardHTML += '<div class="contact-details"><div class="contact-name">'+data.results[0].name.first+ " " + data.results[0].name.last+'</div><div class="contact-phone">'+ phone +'</div><div class="contact-email">'+data.results[0].email+'</div></div>';
  cardHTML+='</div>';
  $(".phone-contacts").html($(".phone-contacts").html() + cardHTML);
}

$(document).on("mousewheel", ".phone-contacts-wrapper", function(e){
  ScrollContacts(e);
});

$(document).on("swipe", ".phone-contacts-wrapper", function(e){
  //Not yet implemented.
});

function ScrollContacts(e){
  e.preventDefault();
  var min = 0;
  var viewport = $(".phone-contacts-wrapper").height();
  var max = $(".phone-contacts").prop('scrollHeight');
  var e = window.event || e; //ie compat
  var x = e.wheelDelta;  
  var m = $(".phone-contacts").attr("margin-data");
  if(m == null) m = 0;
  var newMar = clamp(-parseInt(parseInt(max)- parseInt(viewport)),parseInt(m)+parseInt(x),min); 
  SetScrollMargin(newMar);
  
}

function SetScrollMargin(newMar){
  $(".phone-contacts").css("top",parseInt(newMar)+"px");
  $(".phone-contacts").attr("margin-data", parseInt(newMar));
}

//call number
$(document).on("click", ".contact-card", function(){
  var t = $(this).attr("phone-data");
  $("#number-input").val(t);
  CheckNumbers(t);
});

//Add digit to number to dial
$(document).on("click", ".number", function(){
  DialNumPad(this);
});

function DialNumPad(x){
  var n = $(x).html().toString();
  var newNum = $("#number-input").val() + $.trim(n).substring(0,1);
  CheckNumbers(newNum);
  $("#number-input").val(newNum);
}

//check contacts for number dialed
function CheckNumbers(n){
  SetScrollMargin(0);
  var contacts = $(".contact-card");
  console.log(n);
  $(contacts).each(function(x,c){
    var a = $(c).attr("phone-data");
    var b = n.toString();
    //console.log("A: "+ a + "  B: " + b);
    var ind = a.indexOf(b);
    if(ind > -1){
      $(c).show();
      var t = HighlightPhoneNum(a,b);
      SearchChildNodesForPhone(c,t);
    }
    else{
      $(c).hide();
      SearchChildNodesForPhone(c,a);
    }
  });
}

function HighlightPhoneNum (a,b){
  var ind = a.indexOf(b);
  var s = a.substring(0,ind);
  var m = a.substring(ind, ind + b.length);
  var e = a.substring(ind + b.length);
  //console.log("S: "+s+" M: "+m+" E: "+e);
   return s+"<span>"+m+"</span>"+e;   
}

//searchchildnodes to highlight phone
function SearchChildNodesForPhone(cc, t){
  for (var i = 0; i < cc.childNodes.length; i++) {
    
     SearchChildNodesForPhone(cc.childNodes[i], t);
    if($(cc.childNodes[i]).attr("class") == "contact-phone"){
      //console.log("found phone." + $(cc.childNodes[i]).attr("class"));
      $(cc.childNodes[i]).html(t);
    }
  }
}

//Add number to contacts
$(document).on("click", ".phone-pad-input-add", function(){
  $(".phone-pad-alert-panel").toggle();
  $(".phone-pad-alert-panel").html("Added to contacts.");
  setTimeout(function(){
     $(".phone-pad-alert-panel").toggle("fade");
  }, 2000);
});

//Remove phone number
$(document).on("click", ".phone-pad-input-remove", function(){
  $("#number-input").val($("#number-input").val().substring(0, $("#number-input").val().length-1));
  var contacts = $(".contact-card");
  $(contacts).each(function(x,c){
    $(c).show();
    SearchChildNodesForPhone(c,$(c).attr("phone-data"));
  });
});

//make call
$(document).on("click", ".phone-pad-input-call", function(){
  if($("#number-input").val().length < 2){return;}
  $(".phone-pad-alert-panel").toggle();
  $(".phone-pad-alert-panel").html("Calling... "+$("#number-input").val());
  setTimeout(function(){
     $(".phone-pad-alert-panel").toggle("fade");
  }, 2000);
});

//clamp for viewport
function clamp (min,x,max) {
  return x < min ? min : (x > max ? max : x);

}