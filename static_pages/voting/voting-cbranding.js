// JavaScript Document
window.addEventListener('load', function () {
  var rating_containers = document.querySelectorAll('.image-stars')
  for (var container of rating_containers) {
	  var rating_container = container.children[0]
	  for (var star of rating_container.children) {
		  if (star.getAttribute('cloneindex') != null) {
//			  star.setAttribute("onClick", "change_rating(${rating_container}, ${star.getAttribute('cloneindex')});")
//			  star.addEventListener('click', function () {
//				  change_rating(star.getAttribute('cloneindex'), star.getAttribute('cloneindex'))
//			  })
			  star.setAttribute("onClick", "change_rating(this, this.parentNode, this.getAttribute('cloneindex'))")
		  }
	  }
  }
})

function change_rating(whodares, ofwhom, towhat) {
	console.log(whodares)
	console.log(ofwhom)
	console.log(towhat)
	for (var star of ofwhom.children) {
		if (Number(star.getAttribute('cloneindex')) < Number(towhat) + 1) {
			star.setAttribute("src", "sources/funnistar.svg")
		} else {
			star.setAttribute("src", "sources/unfunnistar.svg")
		}
	}
	
	ofwhom.parentNode.getElementsByClassName("image-rating")[0].children[0].innerHTML = towhat
}

//change_rating(${rating_container}, ${star.getAttribute('cloneindex')})