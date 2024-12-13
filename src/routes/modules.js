userUpdate = (username, state) => {

}

visitNameGen = () => {
	num = Math.floor(Math.random() * 9999);
	return "guest"+num
}

threadNumberGen = () => {
	num = (Math.floor(Math.random() * 999999)+100000).toString().substr(0, 6)
 	return num
}

// check4html = (area) => {
//   // const regex = /<[^>]*>/g
//   const regex = /[<>{}]/g;
//   var matches = area.match(regex);

//   console.log(matches)
//   if (matches != null) {
//     counter= 0
//     for (let i = 0; i < matches.length; i++) {
//       if (matches[i] == "<" ) {area = area.replace(matches[i], "&lt;");}
//       else if (matches[i] == ">") {area = area.replace(matches[i],  "&gt;");}
//       if (matches[i] == "{") {area = area.replace(matches[i], "&#123;")}
//       else if (matches[i] == "}") {area = area.replace(matches[i], "&#125;")} 
//     }
//     return area
//   } 
//   else {return area} 
// }

module.exports = {
	userUpdate, 
	visitNameGen,
	threadNumberGen, 
	// check4html,
}