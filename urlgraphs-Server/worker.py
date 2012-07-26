__author__ = 'Kiailandi'

JOBS_KEY = 'jobs'
RESULTS_KEY = "res"


def get_redis():
    import redis
    return redis.Redis()


def main():
    import json
    red = get_redis()
    while True:
        job = red.blpop(JOBS_KEY)
#       debug
        print job[1]
        data = dict(json.loads(job[1]))
        print repr(data)
        print '=' * 80
        for var in data.items():
            print var
            print var[1][0]
            if var[1][0] == 'false':
                data[var[0]] = False
            elif var[1][0] == 'true':
                data[var[0]] = True
            print data[var[0]]
        print '=' * 80
        print data
        from site_analysis import Processor
        print data['Yahoo_Answer']
        urls = data['url']
        for url in urls:
            if not url.startswith("http://"):
               urls[urls.index(url)] = "http://" + url
        data['url'] = urls
        #debug
        print data['timeout']
        print data['profondita']
#       debug
        print data['url']
        process = Processor(data['url'], int(data['profondita']), data['Vbulletin_Section'],
                            data['Vbulletin_Topic'], data['Yahoo_Answer'], data['Turisti_per_caso'], data['DiffBot'],
                            data['All_Ahref'], int(data['timeout']))
        print 'depthroot', process.depthRoot, 'depth', process.current_depth
        for tupla_url in process.analysis():
#           debug [all]
            print 'depthroot', process.depthRoot, 'depth', process.current_depth
            print '\n'
            print 'Sito Iniziale'
            print tupla_url[0]
            print '\n'
            print 'Sequenza siti'
            print tupla_url[1]
            print '\n'
            print 'Profondita', tupla_url[2]
            print '\n'*3
            red.rpush(RESULTS_KEY, json.dumps(tupla_url))

        print "END"


if __name__ == "__main__":
     main()
