__author__ = 'tommaso'

from flask import Flask, render_template, url_for, jsonify, request, Response

app = Flask(__name__)
JOBS_KEY = 'jobs'
RESULTS_KEY = 'res'


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

#   Correzione tipo valori da stringhe a booleani (cercare metodo migliore)
    if  data ['Turisti_per_caso'] == 'false':
        data ['Turisti_per_caso'] = False
    else:
        data ['Turisti_per_caso'] = True

    if  data ['Vbulletin_Topic'] == 'false':
        data ['Vbulletin_Topic'] = False
    else:
        data ['Vbulletin_Topic'] = True

    if  data ['Vbulletin_Section'] == 'false':
        data ['Vbulletin_Section'] = False
    else:
        data ['Vbulletin_Section'] = True

    if  data ['Yahoo_Answer'] == 'false':
        data ['Yahoo_Answer'] = False
    else:
        data ['Yahoo_Answer'] = True

    if  data ['All_Ahref'] == 'false':
        data ['All_Ahref'] = False
    else:
        data ['All_Ahref'] = True

    if  data ['DiffBot'] == 'false':
        data ['DiffBot'] = False
    else:
        data ['DiffBot'] = True

        #   da migliorare, sintassi dispersiva
    if  data ['Turisti_per_caso'] == False and   \
        data ['Vbulletin_Topic'] == False and    \
        data ['Vbulletin_Section'] == False and  \
        data ['Yahoo_Answer'] == False and       \
        data ['All_Ahref'] == False and          \
        data ['DiffBot'] == False:
        data ['DiffBot'] = True
#       debug
        print data ['DiffBot']

#   urls = ['http://www.google.com', 'www.facebook.com']
#    data = dict(
#      timeout=30.,
#      urls=urls,
#    )

    db.rpush(JOBS_KEY, json.dumps(data))
    return jsonify(success=True)

@app.route('/sse/')
def sse():
    def generate():
        red = get_redis()
        while True:
#           debug
            print "sto per fare la blpop"
            res = red.blpop(RESULTS_KEY,30)
#           debug
            print "blpop fatta"
            # elaboro res
#           debug
            print repr(res)
            yield res
            if res[1][1] == 'end':
                break
#       debug
        print 'tutto ok'
    return Response(generate())


if __name__ == "__main__":
    app.run(debug=True)
