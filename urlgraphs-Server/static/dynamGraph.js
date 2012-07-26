function Graph(){

    var w = 1500
        , h = 1400
        , gravity = 0.25
        , distance = 30
        , charge = -7
        , nodes = []
        , links = []
        , vis = d3.select("#chart")
            .append("svg:svg")
            .attr("width", w)
            .attr("height", h)
        , color = d3.scale.category10()
        , force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .gravity(gravity)
            .distance(distance)
            .charge(charge)
            .size([w, h])

    force.on("tick", function() {
        var node = vis.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }
            )

            , link = vis.selectAll("line.link")
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
            .attr("y2", function(d) { return d.target.y; })
            .style("stroke", function(d) {return color(d.depth);});

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.dpid;}).call(force.drag);

        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .call(force.drag);

        nodeEnter.append("svg:image")
            .attr("class", "circle")
            .attr("xlink:href", "http://www.h-old.com/images/cerchio_verde.png")
            .attr("x", "-8px")
            .attr("y", "-8px")
            .attr("width", "16px")
            .attr("height", "16px");

        nodeEnter.append("svg:text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
        nodeEnter.append("title")
            .text(function(d) { return d.id; });

        node.exit().remove();
    }


    var node_cache = [];
    function get_or_add_node(id) {
        if (node_cache[id] === undefined) {
            node_cache[id] = { id : id };
            nodes.push(node_cache[id]);
        }
        return node_cache[id];
    }

    var link_cache = [];
    function get_or_add_link(source, target, depth) {
        if (link_cache[source.id] === undefined) {
            link_cache[source.id] = [];
        }
        if (link_cache[source.id][target.id] === undefined) {
            link_cache[source.id][target.id] = { source: source, target: target, depth: depth };
            links.push(link_cache[source.id][target.id]);
        }
        return link_cache[source.id][target.id];
    }

    function Add(source, targets, depth) {
        var n1
            , n2

        if(source != undefined && targets != undefined && depth != undefined){

            n1 = get_or_add_node(source);

            for (var i in targets) {
                n2 = get_or_add_node(targets[i]);
                get_or_add_link(n1, n2, depth);
            }
        }
        force
            .nodes(nodes)
            .links(links)
            .start();
        recalc();
    }

    window.add = Add;
}

