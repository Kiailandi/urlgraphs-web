__author__ = 'tommaso'

from flask import Flask, request, render_template, url_for, redirect

app = Flask(__name__)

@app.route("/")
def index():
#   file = open("../GI.html", 'r')
#   app = file.read()
#   file.close()
#   return app
    url_for('static', filename='bootstrap.css')
    url_for('static', filename='bootstrap-responsive.css')
    url_for('static', filename='docs.css')
    return render_template('GI.html')

@app.route("/icencold")
def show_input():
    return "Brace urself, Winter is comin"

@app.errorhandler(404)
def page_not_found(error):
    return "ERROR 404 PAGINA INESISTENTE", 404



#@app.route('/info/')
#def info():
#    param = request.args.get('param')
#    return param
#@app.route("/input=<input>")
#def show_input(input):
#    return "Input: %s" % input
#
#@app.route("/input=<input>/depth=<int:depth>")
#def show_depth(input, depth):
#    return show_input(input) + " " + "Depth: %d" % depth
#
#@app.route("/input=<input>/depth=<int:depth>/timeout=<int:timeout>")
#def show_timeout(input, depth, timeout):
#    return show_depth(input, depth) + " " + "Timeout: %d" % timeout
#
#@app.route("/input=<input>/depth=<int:depth>/timeout=<int:timeout>/output=<output>")
#def show_output(input, depth, timeout, output):
#    return show_timeout(input, depth, timeout) + " " + "Output: %s" %output
#
#@app.route("/input=<input>/depth=<int:depth>/timeout=<int:timeout>/output=<output>/fake=<fake>")
#def show_fake(input, depth, timeout, output, fake):
#    return show_output(input, depth, timeout, output) + " " + "Fake: %s" %fake

if __name__ == "__main__":
    app.run(debug=True)
