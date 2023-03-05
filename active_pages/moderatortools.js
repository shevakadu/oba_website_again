// JavaScript Document

var halted_modlogin = null

var requestgate = new XMLHttpRequest()
var requesturl = "http://localhost:3000/check_moderator_account"
var params = null

function get_submissions() {
	requesturl = "http://localhost:3000/get_all_submissions"
	params = `username=${document.getElementById("mod-login").value}&password=${document.getElementById("mod-password").value}`
	
    requestgate.open("POST", requesturl, true)
	requestgate.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	requestgate.onreadystatechange = function() {
        if (requestgate.readyState == XMLHttpRequest.DONE) {
			const all_submissions = JSON.parse(requestgate.responseText)
			console.log(all_submissions)
			
			for (var submission in all_submissions) {
				console.log(submission)
				console.log(all_submissions[submission])
                var element = document.createElement("div")
                element.className = "moderatortools-submission"
                element.innerHTML = all_submissions[submission]
				document.body.appendChild(element)
			}
			
        }
	}
    requestgate.send(params)
}

function modlogin() {
	if (document.getElementById("mod-login").value.length < 2 || document.getElementById("mod-password").value.length < 2) {
		halted_modlogin = "modauth-field-empty"
	}
	
	if (halted_modlogin != null) {
		document.getElementById("modlogin-info").innerHTML = "НАЛИЧИЕ НЕЗАПОЛНЕННОГО ПОЛЯ"
		document.getElementById("modlogin-info").style.color = "#898989"
		setTimeout(function() {
			document.getElementById("modlogin-info").style.color = "#FFFFFF"
		}, 1000)
	} else {
		if (document.getElementById("mod-login").value.indexOf('\'') > -1 || document.getElementById("mod-password").value.indexOf('\'') > -1) {
			halted_modlogin = "modauth-field-empty"
			document.getElementById("modlogin-info").innerHTML = "НАЛИЧИЕ ЗАПРЕЩЕННОГО ЗНАКА (')"
			document.getElementById("modlogin-info").style.color = "#898989"
			setTimeout(function() {
				document.getElementById("modlogin-info").style.color = "#FFFFFF"
			}, 1000)
		} else {
			document.getElementById("modlogin-info").innerHTML = "АУТЕНТИФИКАЦИЯ"
			
			params = `username=${document.getElementById("mod-login").value}&password=${document.getElementById("mod-password").value}`
			console.log("login log: data about to be sent: " + params)

			requestgate.open("POST", requesturl, true)
			requestgate.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
			requestgate.onreadystatechange = function() {
				if (requestgate.readyState == XMLHttpRequest.DONE) {
					if (requestgate.responseText == "ModLogin-Denied:Incorrect-Key") {
						document.getElementById("modlogin-info").innerHTML = "ОДНО ИЗ ЗНАЧЕНИЙ НЕПРПАВИЛЬНО"
						document.getElementById("modlogin-info").style.color = "#898989"
						setTimeout(function() {
							document.getElementById("modlogin-info").style.color = "#FFFFFF"
						}, 1000)
					} else if (requestgate.responseText == "ModLogin-Allowed:Select") {
						document.getElementById("login-interface").style.display = "none"
						get_submissions()
					
					} else {
						alert(requestgate.responseText);
					}
			}
		}
        requestgate.send(params)

        console.log("login log: sent!")
		}
	}
}

window.onload = function() {
	document.getElementById("modlogin-check").addEventListener("click", modlogin)
}