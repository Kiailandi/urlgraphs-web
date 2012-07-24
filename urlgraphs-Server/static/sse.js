function SSE(){
	if(typeof(EventSource)!=="undefined") {
		var eSource = new EventSource("/sse/");
		eSource.onmessage = function(event) {
            var results = event.data.replace('{', '').replace('}', '').replace('[', '').replace(']', '');
			document.getElementById("serverData").innerHTML +=  '<p>' + results + '</p>';
            window.add(results);
        };
	}
	else {
		document.getElementById("serverData").innerHTML="Whoops! Your browser doesn't receive server-sent events.";
	}
}
