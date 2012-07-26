(function($) {
    $.fn.ahref = function(options) {
        var width = $(this).width()
            , height = options.height
            , id = $(this).attr('id')
            , elements = options.elements
            , R = Raphael(id, width, height)
            , boxes = new Array()
            , start = function() {
                this.ox = this.attr("x");
                this.oy = this.attr("y");
            }

            , left = options.left
            , s_path = ''
            , global_path = null;

        var point = function(x, y) {
            return {
                'x': x,
                'y': y
            };
        };

        function distance(p1, p2){
            return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
        }

        function get_closest_points(pointsA, pointsB) {
            var distances = Array();
            for (var i=0; i<pointsA.length; i++)
                for (var j=0; j<pointsB.length; j++) {
                    var d = distance(pointsA[i], pointsB[j]);
                    distances.push([i, j, d])
                }
            distances = distances.sort(function(a, b){ return a[2] - b[2]; });
            var min_d = distances[0][2]
                , selected = (min_d < 100) ? 2 : 1;

            return {
                'a': pointsA[distances[selected][0]],
                'b': pointsB[distances[selected][1]],
                'pos_a': distances[selected][0],
                'pos_b': distances[selected][1]
            };
        }

        function draw() {
            //delete old path
            s_path = '';
            if (global_path)
                global_path.remove();

            //draw new path
            var last_pointB = -1;
            for (var i = 0; i < boxes.length - 1; i++) {
                var boxA = boxes[i].getBBox()
                    , boxB = boxes[i+1].getBBox()
                    , pointsA = [point(boxA.x + boxA.width, boxA.y),
                        point(boxA.x + boxA.width, boxA.y + boxA.height)]
                    , pointsB = [point(boxB.x, boxB.y),
                        point(boxB.x, boxB.y + boxB.height),
                        point(boxB.x + boxB.width, boxB.y),
                        point(boxB.x + boxB.width, boxB.y + boxB.height)];
                switch (last_pointB) {
                    case 2: pointsA.shift(); break;
                    case 3: pointsA.pop(); break;
                }
                points = get_closest_points(pointsA, pointsB);
                last_pointB = points.pos_b;

                s_path += 'M' + points.a.x + ' ' + points.a.y;
                s_path += 'L' + points.b.x + ' ' + points.b.y;
            }

            global_path = R.path(s_path);
        }

        var move = function(dx, dy) {
            nowX = Math.min(width - this.attr("width"), this.ox + dx);
            nowY = Math.min(height - this.attr("height"), this.oy + dy);
            nowX = Math.max(0, nowX);
            nowY = Math.max(0, nowY);
            this.attr({x: nowX, y: nowY });
            this.box.attr({x: nowX, y: nowY });
            this.text.attr({x: nowX + 2 * this.padding, y: nowY + this.padding + this.wordheight});
            draw();
        };

        for (var i = 0; i < elements.length; i++) {
            var top = height / 2 + i * 5 * Math.pow(-1, i)
                , padding = elements[i].padding ? elements[i].padding : 5
                , margin = elements[i].margin ? elements[i].margin : 20
                , border = elements[i].border ? elements[i].border : 0
                , border_color = elements[i].border_color ? elements[i].border_color : '#000000';

            text = R.text(left + 2 * padding, top, elements[i].text).attr({
                "font-family": "sans-serif",
                "font-size": elements[i].size,
                "fill": elements[i].color,
                "text-anchor": "start"
            });
            box = R.rect(left, top - text.getBBox().height / 2 - padding, text.getBBox().width + 4 * padding, text.getBBox().height + 2 * padding).attr({
                fill: elements[i].bgcolor,
                'stroke-width': border,
                stroke: border_color
            });
            text.toFront();
            boxes[i] = R.rect(left, top - text.getBBox().height / 2 - padding, text.getBBox().width + 4 * padding, text.getBBox().height + 2 * padding).attr({
                fill: 'black',
                'opacity': 0
            });
            boxes[i].text = text;
            boxes[i].box = box;
            boxes[i].margin = margin;
            boxes[i].padding = padding;
            boxes[i].wordheight = text.getBBox().height / 2;
            boxes[i].drag(move, start);

            left += box.getBBox().width + margin;
        }
        draw();
    }
})(jQuery);