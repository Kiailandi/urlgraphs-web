function SSE(){
	if(typeof(EventSource)!=="undefined") {
		var eSource = new EventSource("/sse/");
		eSource.onmessage = function(event) {
            var res = $.parseJSON(event.data)
			document.getElementById("serverData").innerHTML +=  '<p style="color:' + RandomColor() + '">'  + res.source + ':' + res.target + '</p>';
            $('#depthreached').text(res.depth);
            window.add(res.source, res.target, res.depth);
        };
	}
	else {
		document.getElementById("serverData").innerHTML="Whoops! Your browser doesn't receive server-sent events.";
	}
}

function RandomColor(){
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 25)];
        }
        return color;
}
