function SSE(){
	if(typeof(EventSource)!=="undefined") {
		var eSource = new EventSource("/sse/");
		eSource.onmessage = function(event) {
            var res = $.parseJSON(event.data)
			document.getElementById("serverData").innerHTML +=  '<p>' + res.source + ':' + res.target + '</p>';
            setInterval(function()
            {
                window.add(res.source, res.target, res.depth)}, 2500);
        };
	}
	else {
		document.getElementById("serverData").innerHTML="Whoops! Your browser doesn't receive server-sent events.";
	}
}
