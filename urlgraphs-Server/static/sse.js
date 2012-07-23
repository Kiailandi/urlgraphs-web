function SSE(){
	//check for browser support
	if(typeof(EventSource)!=="undefined") {
		//create an object, passing it the name and location of the server side script
		var eSource = new EventSource("/sse/");
		//detect message receipt
		eSource.onmessage = function(event) {
			//debug
//			console.log(event.data);
            var results = event.data.replace('{', '').replace('}', '').replace('[', '').replace(']', '');
			//write the received data to the page
			document.getElementById("serverData").innerHTML +=  '<p>' + results + '</p>';
            SendToGraph(results);
        };
	}
	else {
		document.getElementById("serverData").innerHTML="Whoops! Your browser doesn't receive server-sent events.";
	}
}
