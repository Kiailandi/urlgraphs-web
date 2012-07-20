function Graph(){

    window.add = Add

    var w = 1200,
        h = 700,
        gravity = 0.05,
        distance = 100,
        charge = -100
        nodes = [],
        links = [],
        vis = d3.select("body")
                .append("svg:svg")
                .attr("width", w)
                .attr("height", h);

    var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .gravity(gravity)
                    .distance(distance)
                    .charge(charge)
                    .size([w, h]);
    
    force.on("tick", function() {
        var node = vis.selectAll("g.node")
                      .data(nodes, function(d) {
                                        return d.id;
                                   }
                       );

        var link = vis.selectAll("line.link")
            .data(links, function(d) { return d.source.id + ',' + d.target.id})
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    function recalc() {
        var link = vis.selectAll("line.link")
            .data(links, function(l) {
                return l.source.id + '-' + l.target.id;
            });

        link.enter().append("svg:line")
            .attr("class", "link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.dpid;}).call(force.drag);

        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("svg:image")
            .attr("class", "circle")
            .attr("xlink:href", "https://d3nwyuy0nl342s.cloudfront.net/images/icons/public.png")
            .attr("x", "-8px")
            .attr("y", "-8px")
            .attr("width", "16px")
            .attr("height", "16px");

        nodeEnter.append("svg:text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .text(function(d) { return d.id });

        node.exit().remove();

        force
            .nodes(nodes)
            .links(links)
            .start();
    }

    function contains_node(node, nodes){
        //FIXME;
        var ret = -1;
        $(nodes).each(function(){
            if(this.id === node.id) {
                ret = 1;
            }
        });
        return ret;
    }

    function contains_link(link, links){
        //FIXME;
        var ret = -1;
        $(links).each(function(){
            if(this.source === link.source && this.target === link.target){
                ret = 1
            }
        });
        return ret;
    }

    function Add(l1, l2) {

        var n1 = {id: l1};
        console.log(contains_node(n1, nodes))
        test ? expression1 : expression2
        if(contains_node(n1, nodes) == -1) {
            console.log(n1);
            nodes.push(n1);
        }

        var n2 = {id: l2};
        console.log(contains_node(n2, nodes))
        if(contains_node(n2, nodes) == -1) {//
            console.log(n2)
            nodes.push(n2);
        }

        var l12 = {source: n1, target: n2};
        console.log(contains_link(l12, links))
        if(contains_link(l12, links) == -1) {
            console.log(l12);
            links.push(l12);
        }

        force
            .nodes(nodes)
            .links(links)
            .start();
        recalc();
    }

    force
        .nodes(nodes)
        .links(links)
        .start();
    recalc();
}

