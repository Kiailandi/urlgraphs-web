__author__ = 'tommaso'

from flask import Flask, render_template, url_for, jsonify, request

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
#   import pdb; pdb.set_trace()
    db = get_redis()

    tmp = request.form

#   cosa schifosa da modificare al piu' presto
    data = dict()

    data['profondita'] = tmp['profondita']
    data['timeout'] = tmp['timeout']
    data ['Turisti_per_caso'] = tmp['Turisti_per_caso']
    data ['Vbulletin_Topic'] = tmp['Vbulletin_Topic']
    data ['Vbulletin_Section'] = tmp['Vbulletin_Section']
    data ['Yahoo_Answer'] = tmp['Yahoo_Answer']
    data ['All_Ahref'] = tmp['All_Ahref']
    data ['DiffBot'] = tmp['DiffBot']

#   debug
    print "Data recived:"
    print data

    urls = tmp['input'].split('\n')
#   debug
    print urls

#   pulisce da eventuali componenti vuote
    urls = [url for url in urls if url]
#   semi-schifezza come sopra
    data['url'] = urls
#   debug
    print urls

    try:
        if int(data['profindita']) > 5:
            data['profondita'] = 3
    except:
        data['profondita'] = 3
    finally:
#       dubug
        print data['profondita']

    try:
        if int(data['timeout']) > 120:
            data['timeout'] = 30
    except:
        data['timeout'] = 30.
    finally:
#       dubug
        print data['timeout']
#   da migliorare, sintassi dispersiva e valori come stringhe e non booleani
    if  data ['Turisti_per_caso'] == 'false' and   \
        data ['Vbulletin_Topic'] == 'false' and    \
        data ['Vbulletin_Section'] == 'false' and  \
        data ['Yahoo_Answer'] == 'false' and       \
        data ['All_Ahref'] == 'false' and          \
        data ['DiffBot'] == 'false':
        data ['DiffBot'] = 'true'
#       debug
        print data ['DiffBot']

#   urls = ['http://www.google.com', 'www.facebook.com']
#    data = dict(
#      timeout=30.,
#      urls=urls,
#    )

    db.rpush(JOBS_KEY, json.dumps(data))

    return jsonify(success=True)


if __name__ == "__main__":
    app.run(debug=True)
