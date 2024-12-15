
document.addEventListener("DOMContentLoaded", (event) => {
  etag2emoticons = () => {
	const replies = document.querySelector('.thread')
	const regex = /:\w+:/g;
	const matches =  replies.innerHTML.match(regex); 
	imgTemplate = '<img src="replacethisyo">'

		if (matches != null) {
			for (let i = 0; i < matches.length; i++) {
				let index = emoticons.findIndex(item => item.etag == matches[i]) 
				try {
					let replacement = imgTemplate.replace("replacethisyo", emoticons[index].link)
					replies.innerHTML = replies.innerHTML.replace(matches[i], replacement );
				} catch {continue}
			}
		}
	}
 
	etag2emoticons()

	dragElement(document.getElementById("replyBox"));

	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		document.getElementById("replyBoxHeader").onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

	var replyBox = document.getElementById("replyBox")
	replyBox.style.display = "none"

	replyBoxTrigger = (num) => {
		var topCoor = document.getElementById(num).offsetTop 
		var leftCoor = document.getElementById(num).offsetLeft + document.getElementById(num).offsetWidth + 50
		var placeholder = document.getElementById('replyBoxTarget')
		var parent = document.getElementById('replyBoxParent')
		replyBox.style.top = topCoor + "px"
		replyBox.style.left = leftCoor + "px"
		replyBoxTarget.innerHTML = "reply to #" + num
		parent.value = num 
		replyBox.style.display = "flex"
	}

	replyBoxClose = () => {
		event.preventDefault();
		replyBox.style.display = "none"
	}

	var thread = document.querySelector(".thread__reply");
	check4html = () => {
		const regex = /<[^>]*>/g
		const matches = thread.innerHTML.match(regex);
		if (matches != null) {} 
		else {return false}
	}

	document.getElementById("replyBox").addEventListener('submit', async (event) => {
		event.preventDefault(); 
    const formData = new FormData(document.getElementById("replyBox"));
    const dataSend = Object.fromEntries(formData.entries());
	  const response = await fetch('/submitReply', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify(dataSend)
	  }).catch(error => console.error('Error:', error))
	  document.getElementById("replyBox").style.display = "none"
	  document.getElementById("replyBoxContent").value = ""
	});

	// check4image = async (url) => {
	// 	try {
	// 		const response = await fetch(url, {method: 'HEAD'})
	// 		if (!response.ok) {
	// 			console.log("its not ok")
	// 			return false}
	// 		if (response.ok) {
	// 			console.log("its ok")
	// 		  return response.headers.get("Content-Type").startsWith("image")
	// 		} 
	// 	} catch (error) {
	// 			return false
	// 	}
	// }

 	// url2image = async() => {
  //   const replies = document.querySelectorAll('pre')
  //   const regex = /::(\S+?)::/g;
  //   matches = [];
    
  //   replies.forEach((rep) => {
  // 		eachmatch = rep.innerHTML.match(regex);
  // 		if (eachmatch != null ) {
  // 			for (var i = 0; i < eachmatch.length; i++) {
  // 				matches.push(eachmatch[i].toString())
  // 			}
  // 		}
	// 	});

  //   if (matches != null) {
	// 		for (let i = 0; i < matches.length; i++) {
	// 			check4image(matches[i].slice(2,-2)).then(
	// 				(value) => {
	// 					if (value == true) {
	// 						img = `<a href="`+matches[i].slice(2,-2)+`" target="_blank" rel="noopener noreferrer"><img src="`+matches[i].slice(2,-2)+`" alt="lol">`
	// 						replies.forEach((rep) => {
	// 							eachmatch = rep.innerHTML.match(matches[i])
	// 							if(eachmatch!=null){
	// 								rep.innerHTML = rep.innerHTML.replace(matches[i], img)
	// 							}
	// 						})
	// 					}
	// 					if (value == false) {
	// 						hyperlink = '<a class="hyperlink" href= "' + matches[i].slice(2,-2)+'">'+ matches[i].slice(2,-2) +'</a>'
	// 						replies.forEach((rep) => {
	// 							eachmatch = rep.innerHTML.match(matches[i])
	// 							console.log(matches[i])
	// 							if(eachmatch!=null){
	// 								console.log("cehc")
	// 								rep.innerHTML = rep.innerHTML.replace(matches[i], hyperlink)
	// 							}
	// 						})
	// 					}
	// 				},
	// 				(error) => {console.log(error)}
	// 			)
	// 		}
  // 	}
  // }

 
});

