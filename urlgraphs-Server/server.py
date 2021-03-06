__author__ = 'Kiailandi'

from flask import Flask, render_template, jsonify, request, Response, json, random

app = Flask(__name__)
app.debug = True
JOBS_KEY = 'jobs'
RESULTS_KEY = 'res'


def get_redis():
    import redis
    return redis.Redis()


@app.route("/")
def index():
    return render_template('Index.html')


@app.errorhandler(404)
def page_not_found(error):
    return "PAGINA INESISTENTE", 404


@app.route('/submit/', methods=['POST'])
def submit():
    red = get_redis()
    resultKey = 0
    while(red.exists(resultKey)):
        resultsKey = 'res' + random.randint(0, 1000000000000)
    data = dict(request.form)
    data['key'] = resultsKey
#   debug
    print "Data recived:"
    print repr(data)
    print 'prima'
    print data['url']
    data['url'] = [url for url in data['url'][0].split('\n') if url]
#   debug
    print 'dopo'
    print data['url']
    data['profondita'] = data['profondita'][0]
    data['timeout'] = data['timeout'][0]
    try:
        if int(data['profondita']) > 4:
            data['profondita'] = 4
    except:
        data['profondita'] = 4
    finally:
#       dubug
        print data['profondita']

    try:
        if int(data['timeout']) > 60:
            data['timeout'] = 60
    except:
        data['timeout'] = 60.
    finally:
#       dubug
        print data['timeout']

    red.rpush(JOBS_KEY, json.dumps(data))
    return jsonify(success=True)


@app.route('/sse/')
def sse():
    def generate():
        red = get_redis()
        while True:
#           debug
            print 'sto per fare la blpop'
            res = (RESULTS_KEY, json.loads(red.blpop(RESULTS_KEY)[1]))
#           debug
            print 'blpop fatta'
            print repr(res)
            print 'sto per yieldare'
            yield 'data: ' + json.dumps( {
                'source': res[1][0],
                'target': res[1][1],
                'depth': res[1][2],
            }) + '\n\n'
#           debug
            print "Ho yieldato"
#           debug
            print '\n'
#   debug
    print 'sto aspettando'
    return Response(generate(), mimetype = "text/event-stream")

@app.route('/dlres/', methods=['GET'])
def dlres():
    red = get_redis()



if __name__ == "__main__":
    app.run(debug=True)
