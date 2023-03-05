var halt_reason = null
var check_error = null

var requestgate = new XMLHttpRequest()
var requesturl = "http://localhost:3000/check_submittor_account"
var params = null

var pagenumber = 1

window.onload = function() {
	
	function submit() {
		
		for (var wizardstep of document.getElementsByClassName("questionnaire-page")) {
			if (wizardstep.attributes['name'].value != "21") {
				wizardstep.style.display = "none"
			} else {
				wizardstep.style.display = "block"
			}
		}
		
		document.getElementById("submission-back").style.display = "none"
		document.getElementById("submission-progress-console").innerHTML = ""
		
		function add_to_console(line) {
			document.getElementById("submission-progress-console").innerHTML = document.getElementById("submission-progress-console").innerHTML + line + "<br>"
		}
		
		add_to_console("STARTING SUBMISSION PROCESS...")
		add_to_console("PERFORMING EARLY CHECKS...")
		
		check_error = null
		
		for (var field of document.getElementsByClassName("submittable")) {
			if (field.value.length < 2) {
				check_error = "field_too_short"
				break
			}
		}
		
		if (check_error != null) {
			add_to_console("<span style=\"color: red\">WOMP!</span> ONE OR MORE OF THE FIELDS' CONTENTS ARE TOO SHORT!")
			add_to_console("YOU CAN GO BACK USING THE BUTTON BELOW.")
			document.getElementById("submission-back").style.display = "block"
		} else {
			
			check_error = null
			for (field of document.getElementsByClassName("submittable")) {
				if (field.value.indexOf('\'') > -1) {
					check_error = "field_illegal_character"
					break
				}
			}
			
			if (check_error != null) {
				add_to_console("<span style=\"color: red\">WOMP!</span> ONE OR MORE FIELDS CONTAIN AN APOSTROPHE.")
				add_to_console("YOU CAN GO BACK USING THE BUTTON BELOW.")
				document.getElementById("submission-back").style.display = "block"
			} else {
				add_to_console("EARLY CHECKS COMPLETED")
				
				add_to_console("COLLECTING TEXT FROM INPUT FIELDS...")
				requesturl = "http://localhost:3000/submit_work"
            	params = `email=${localStorage.OBASubmitEmail}&`
			
				for (field of document.getElementsByClassName("submittable")) {
					params = params + field.name + "=" + field.value + "&"
				}
				
				add_to_console("SENDING CONTENTS...")
				params = params.slice(0, -1)
				
				console.log(params)
				
				requestgate.open("POST", requesturl, true)
				requestgate.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
				requestgate.onreadystatechange = function() {
                	if (requestgate.readyState == XMLHttpRequest.DONE) {
						console.log(requestgate.responseText)
						if (requestgate.responseText == "Submission-Complete:Submit") {
							add_to_console("SUCCESS!")
							
							document.getElementById("submission-success").style.display = "block"
							window.scrollTo(0, document.body.scrollHeight);
						}
					}
				}
				requestgate.send(params)
			}
		}
	}
	
	function start_questionnaire() {
		console.log("asdvfgdfg")
		for (var page of document.getElementsByClassName("page")) {
			page.style.display = "none"
		}
		
		pagenumber = 1
		document.getElementById("the-great-questionnaire").style.display = "block"
		
		for (page of document.getElementsByClassName("questionnaire-page")) {
			console.log(page.attributes['name'].value)
			console.log(page)
			if (page.attributes['name'].value != "1") {
				page.style.display = "none"
			} else {
				page.style.display = "block"
			}
		}
		
		for (var button of document.getElementsByClassName("questionnaire-page-submit")) {
			console.log(button)
			button.addEventListener("click", function() {
				console.log("clickity clicc!!1!!11111!1")
				for (page of document.getElementsByClassName("questionnaire-page")) {
					if (page.attributes['name'].value == pagenumber.toString()) {
						page.style.display = "none"
					}
				}
				
				pagenumber += 1
				
				for (page of document.getElementsByClassName("questionnaire-page")) {
					if (page.attributes['name'].value == pagenumber.toString()) {
						page.style.display = "block"
					}
				}
			})
		}
		
		for (var button of document.getElementsByClassName("questionnaire-page-back")) {
			console.log(button)
			button.addEventListener("click", function() {
				console.log("clickity unclicc!!1!!11111!1")
				for (page of document.getElementsByClassName("questionnaire-page")) {
					if (page.attributes['name'].value == pagenumber.toString()) {
						page.style.display = "none"
					}
				}
				
				pagenumber -= 1
				
				for (page of document.getElementsByClassName("questionnaire-page")) {
					if (page.attributes['name'].value == pagenumber.toString()) {
						page.style.display = "block"
					}
				}
			})
		}
	}
	
	function register() {
		halt_reason = null
        for (var field of document.getElementsByClassName("submittable-register")) {
            if (field.value.length < 2) {
                halt_reason = "register-field-too-short"
                break
            }
        }

        for (field of document.getElementsByClassName("submittable-register")) {
            if (field.value.indexOf('\'') > -1) {
                halt_reason = "register-field-contains-illegal-character"
                break
            }
        }
		
		if (halt_reason != null) {
			console.log(halt_reason)
            if (halt_reason == "register-field-too-short") {
                document.getElementById("register-info").innerHTML = "You left one of the register fields empty!"
            } else if (halt_reason == "register-field-contains-illegal-character") {
                document.getElementById("register-info").innerHTML = "Fields cannot contain apostrophes."
            }	

            document.getElementById("register-info").style.transition = "color 0s"
            document.getElementById("register-info").style.color = "#5A5A5A"
            setTimeout(function() {
                document.getElementById("register-info").style.transition = "color 1s"
                document.getElementById("register-info").style.color = "#FFFFFF"
                document.getElementById("register-info").style.backgroundColor = "#FFFFFF"
            }, 1500)
		} else {
			document.getElementById("login-info").innerHTML = "Please wait, creating account..."
			
			requesturl = "http://localhost:3000/create_submittor_account"
            params = ""
			
			for (field of document.getElementsByClassName("submittable-register")) {
				params = params + field.name + "=" + field.value + "&"
			}
			
			params = params.slice(0, -1)

			console.log("create an account: " + params)

            requestgate.open("POST", requesturl, true)
            requestgate.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            requestgate.onreadystatechange = function() {
                if (requestgate.readyState == XMLHttpRequest.DONE) {
					console.log(requestgate.responseText)
					if (requestgate.responseText == "Register-Complete:Submit") {
						document.getElementById("login-info").innerHTML = "Account created!"
						
						localStorage.OBASubmitEmail = document.getElementById("register-email").value
						localStorage.OBASubmitPassword = document.getElementById("register-password").value
						
						console.log("yayyy?????????")
						start_questionnaire()
					} else if (requestgate.responseText == "Register-Denied:Exists") {
						document.getElementById("register-info").innerHTML = "An account with tha email already exists."
						document.getElementById("register-info").style.transition = "color 0s"
						document.getElementById("register-info").style.color = "#5A5A5A"
						setTimeout(function() {
							document.getElementById("register-info").style.transition = "color 1s"
							document.getElementById("register-info").style.color = "#FFFFFF"
							document.getElementById("register-info").style.backgroundColor = "#FFFFFF"
						}, 1500)
					}
				}
			}
			requestgate.send(params)
		}
	}
	
    function login() {
        halt_reason = null
        for (var field of document.getElementsByClassName("submittable-login")) {
            if (field.value.length < 2) {
                halt_reason = "login-field-too-short"
                break
            }
        }

        for (field of document.getElementsByClassName("submittable-login")) {
            if (field.value.indexOf('\'') > -1) {
                halt_reason = "login-field-contains-illegal-character"
                break
            }
        }

        if (halt_reason != null) {
			console.log(halt_reason)
            if (halt_reason == "login-field-too-short") {
                document.getElementById("login-info").innerHTML = "You left one of the login fields empty!"
            } else if (halt_reason == "login-field-contains-illegal-character") {
                document.getElementById("login-info").innerHTML = "Fields cannot contain apostrophes."
            }	

            document.getElementById("login-info").style.transition = "color 0s"
            document.getElementById("login-info").style.color = "#5A5A5A"
            setTimeout(function() {
                document.getElementById("login-info").style.transition = "color 1s"
                document.getElementById("login-info").style.color = "#FFFFFF"
                document.getElementById("login-info").style.backgroundColor = "#FFFFFF"
            }, 1500)
        } else {
            document.getElementById("login-info").innerHTML = "Please wait, checking if such account exists."

            requesturl = "http://localhost:3000/check_submittor_account"
            params = `email=${document.getElementById("login-email").value}&password=${document.getElementById("login-password").value}`

			console.log("log into: " + params)

            requestgate.open("POST", requesturl, true)
            requestgate.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            requestgate.onreadystatechange = function() {
                if (requestgate.readyState == XMLHttpRequest.DONE) {
					console.log(requestgate.responseText)
					if (requestgate.responseText == "Login-Denied:Incorrect-Email") {
						document.getElementById("login-info").innerHTML = "Womp! We couldn't find accounts with that email."
						
						document.getElementById("login-info").style.transition = "color 0s"
						document.getElementById("login-info").style.color = "#5A5A5A"
						setTimeout(function() {
							document.getElementById("login-info").style.transition = "color 1s"
							document.getElementById("login-info").style.color = "#FFFFFF"
							document.getElementById("login-info").style.backgroundColor = "#FFFFFF"
						}, 1500)
					} else if (requestgate.responseText == "Login-Denied:Incorrect-Password") {
						document.getElementById("login-info").innerHTML = "Womp! The password does not match."
						
						document.getElementById("login-info").style.transition = "color 0s"
						document.getElementById("login-info").style.color = "#5A5A5A"
						setTimeout(function() {
							document.getElementById("login-info").style.transition = "color 1s"
							document.getElementById("login-info").style.color = "#FFFFFF"
							document.getElementById("login-info").style.backgroundColor = "#FFFFFF"
						}, 1500)
					} else if (requestgate.responseText == "Login-Allowed:Submit") {
//						document.getElementById("success-login").style.color = "#BB9959"
						
						localStorage.OBASubmitEmail = document.getElementById("login-email").value
						localStorage.OBASubmitPassword = document.getElementById("login-password").value
						
						start_questionnaire()
					
					// attempt to get submissions
					
					} else {
						console.log(requestgate.responseText);
					}
				}
			}
			requestgate.send(params)
		}
	}

//	for (var wizardstep of document.getElementsByClassName("page")) {
//		wizardstep.style.display = "none"
//	}
//	document.getElementById("welcome").style.display = "block"
	
	
	// Welcome page
	document.getElementById("welcome-next").addEventListener("click", function() {
		document.getElementById("welcome").style.display = "none"
		document.getElementById("accountsolution").style.display = "block"
	})
	
	// Login page
	document.getElementById("accountsolution-login").addEventListener("click", function() {
		document.getElementById("accountsolution").style.display = "none"
		document.getElementById("accountsolution-loginpage").style.display = "block"
	})
	
	// Register page
	document.getElementById("accountsolution-register").addEventListener("click", function() {
		document.getElementById("accountsolution").style.display = "none"
		document.getElementById("accountsolution-registerpage").style.display = "block"
	})
	
	// Login and register mapping
	document.getElementById("accountsolution-login-check").addEventListener("click", login)
	document.getElementById("accountsolution-register-submit").addEventListener("click", register)
	
	// Questionnaire final question
	document.getElementById("the-great-questionnaire-gateway").addEventListener("click", submit)
	
	// Submission progress bug fix
	document.getElementById("submission-back").addEventListener("click", function() {
		document.getElementById("submission-back").style.display = "none"
		for (var wizardstep of document.getElementsByClassName("questionnaire-page")) {
			if (wizardstep.attributes['name'].value == "21") {
				wizardstep.style.display = "none"
			}
		}
	})
}