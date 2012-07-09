__author__ = 'tommaso'

from flask import Flask, render_template, url_for, jsonify

app = Flask(__name__)

JOBS_KEY = 'jobs'


def get_redis():
    import redis

    return redis.Redis()


@app.route("/")
def index():
    url_for('static', filename='bootstrap.css')
    url_for('static', filename='bootstrap-responsive.css')
    url_for('static', filename='docs.css')
    return render_template('GI.html')


@app.route("/icencold")
def winter():
    return "Brace urself, Winter is comin"

@app.errorhandler(404)
def page_not_found(error):
    return "ERROR 404 PAGINA INESISTENTE", 404

@app.route('/submit/', methods=['POST'])
def submit():
    import json
    db = get_redis()
    import requests

#    urls = ['http://www.google.com', 'www.facebook.com']

#    data = dict(
#      timeout=30.,
#      urls=urls,
#    )

    db.rpush(JOBS_KEY, json.dumps(data))

    return jsonify(success=True)


if __name__ == "__main__":
    app.run(debug=True)
