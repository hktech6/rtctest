/**
 * Set a cookie
 * @param {String} cname, cookie name
 * @param {String} cvalue, cookie value
 * @param {Int} exdays, number of days before the cookie expires 
 */


function setCookie(cname, cvalue, exdays =0) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get a cookie
 * @param {String} cname, cookie name
 * @return {String} String, cookie value 
 */
function getCookie(cname) {
  var name = cname + "=";  
  var decodedCookie = decodeURIComponent(document.cookie);
  //console.log("dd="+document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


/**
 * Delete a cookie
 * @param {String} cname, cookie name
 */
function deleteCookie(cname) {
    var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000 * 60 * 60 * 24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    //console.log(cname);
    window.document.cookie = cname + "=" + "; " + expires;//Set the cookie with name and the expiration date

}

function get_cookies_array() {

    var cookies = {};

    if (document.cookie && document.cookie != '') {
        var split = document.cookie.split(';');
        for (var i = 0; i < split.length; i++) {
            var name_value = split[i].split("=");
            name_value[0] = name_value[0].replace(/^ /, '');
            cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
        }
    }

    return cookies;

}

function eraseCookie(cname)
{
    //setCookie('is_joined', "", -1);
    setCookie(cname, "", -1);
    console.log('The cookie has been successfully erased.');
}

function destroyCookies() {
    //console.log("ssd");
    var cookies = get_cookies_array();
    //console.log('cookies');
    //console.log(getCookie("is_joined"));
    for (var name in cookies) {
        console.log(name);
        eraseCookie(name);
    }
}

function removeCookies() {
    var res = document.cookie;
   // console.log(res);
    var multiple = res.split(";");
    for (var i = 0; i < multiple.length; i++) {
        var key = multiple[i].split("=");
        document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC";
    }
}

