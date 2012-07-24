function Graph(){

    var w = 1500,
        h = 1400,
        gravity = 0.05,
        distance = 15,
        charge = -15,
        nodes = [],
        links = [],
        vis = d3.select("#chart")
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
            //"https://d3nwyuy0nl342s.cloudfront.net/images/icons/public.png
            .attr("xlink:href", "http://www.h-old.com/images/cerchio_verde.png")
            .attr("x", "-8px")
            .attr("y", "-8px")
            .attr("width", "16px")
            .attr("height", "16px");

        nodeEnter.append("svg:text")
            .attr("class", "nodetext")
            .attr("dx", 12)
            .attr("dy", ".35em")
            //.text(function(d) { return d.id });
        nodeEnter.append("title")
            .text(function(d) { return d.id; });

        node.exit().remove();

//        force
//            .nodes(nodes)
//            .links(links)
//            .start();
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

//    function contains_node(nodeID, nodes){
//
//        var ret = {id: nodeID};
//        $(nodes).each(function(){
//            if(this.id === ret.id) {
//                ret = 0;
//            }
//        });
//        return ret;
//    }
//
//    function contains_link(linkS, linkT, links){
//        var ret = {source: linkS, target: linkT};
//        $(links).each(function(){
//            if(this.source === ret.source && this.target === ret.target){
//                ret = 0;
//            }
//        });
//        return ret;
//    }

    function Add(res) {

        if(res != undefined){
            console.log(res);
            res = res.replace(/"/g, '');
            res = res.replace(':', '*');
            res = res.replace(':', '*');
            res = res.replace('*', ':');
            var source = res.split('*');
            var targets = source[1].split(',');

            var n1 = {id: source[0]};
            if(contains_node(n1, nodes) == -1) {
                nodes.push(n1);
            }
            else{
                $(nodes).each(function(){
                    if(this.id === n1.id) {
                        n1 = this;
                    }
                });
            }

            for (var i in targets){
                var n2 = {id: targets[i]};
                if(contains_node(n2, nodes) == -1) {
                    nodes.push(n2);
                }
                else{
                    $(nodes).each(function(){
                        if(this.id === n2.id) {
                            n2 = this;
                        }
                    });
                }

                var l12 = {source: n1, target: n2};
                if(contains_link(l12, links) == -1) {
                    links.push(l12);
                }
                else{
                    $(links).each(function(){
                        if(this.source === l12.source && this.target === l12.target){
                            l12 = this;
                        }
                    });
                }

                force
                    .nodes(nodes)
                    .links(links)
                    .start();
                recalc();
            }
        }

//        var n1 = contains_node(source[0], nodes);
//        if(n1 != 0) {
//        nodes.push(n1);
//
//        var n2 = contains_node(targets[i], nodes);
//        if(n2 != 0) {
//            nodes.push(n2);
//        }
//
//        var l12 = contains_link(l1, l2, links);
//        if(l12 != 0) {
//            links.push(l12);
//        }

    }

    window.add = Add
//
//    force
//        .nodes(nodes)
//        .links(links)
//        .start();
//    recalc();
}

