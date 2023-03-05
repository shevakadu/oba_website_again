// JavaScript Document
console.log("bruh moment");

function close_menu() {
	document.getElementById('menu-closed').style.display = 'block';
	document.getElementById('menu-open').style.display = 'none';
	document.getElementById('menu').style.display = 'none';
}

function change_page(page_src) {
	document.getElementById('menu-closed').style.display = 'block';
	document.getElementById('menu-open').style.display = 'none';
	document.getElementById('menu').style.display = 'none';
	document.getElementById('frame').src = page_src;
}

function toggle_subsection(subsection_id) {
	if (document.getElementById(subsection_id).style.display == 'block') {
		document.getElementById(subsection_id).style.display = 'none'
	} else {
		document.getElementById(subsection_id).style.display = 'block'};
}

function jump_to_hash(hash) {
	location.hash = "#" + hash;               
}

function is_logged_in() {
//	 && 
//	    localStorage.OBAaccount_email != "purged_value@yeah.lol" &&
//	    localStorage.OBAaccount_password != "purged_value12-123"
	console.log("look, this is a boolean:" + localStorage.OBAaccount_loggedIn)
	console.log("OR SO YOU THOUGHT" + typeof localStorage.OBAaccount_loggedIn)
	if (localStorage.OBAaccount_loggedIn === true) {
		return true
	} else {
		return false
	}
}

function account_page() {
	console.log("here is a check:" + is_logged_in())
	if (is_logged_in()) {
		change_page("pages/account.html")
	} else {
		change_page("pages/works-login.html")
	}
}

function log_in(whoasked) {
	localStorage.OBAaccount_loggedIn = true
	localStorage.OBAaccount_email = whoasked.parentNode.querySelectorAll("#login-email-input")[0].children[0].value
	localStorage.OBAaccount_password = whoasked.parentNode.querySelectorAll("#login-password-input")[0].children[0].value
	document.location.href = "account.html"
}

function log_out() {
	localStorage.OBAaccount_loggedIn = false
	localStorage.OBAaccount_email = "purged_value@yeah.lol"
	localStorage.OBAaccount_password = "purged_value12-123"
	document.location.href = "OBA.html"
}