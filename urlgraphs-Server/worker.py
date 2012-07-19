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
        print job[1]
        data = json.loads(job[1])

#       elaborazione
        from site_analysis import Processor

#       Filtraggio e correzione link in ingresso prima dell'invio
        urls = data['url']
        for url in urls:
            if not url.startswith("http://"):
               urls[urls.index(url)] = "http://" + url
        data['url'] = urls

#       debug
        print data['url']
        process = Processor(data['url'], data['profondita'],data['Vbulletin_Section'],
                            data['Vbulletin_Topic'], data['Yahoo_Answer'], data['Turisti_per_caso'], data['DiffBot'],
                            data['All_Ahref'], data['timeout'])

        for tupla_url in process.analysis():
#           debug [all]
            print '\n'
            print 'Sito Iniziale'
            print tupla_url[0]
            print '\n'
            print 'Sequenza siti'
            print tupla_url[1]
            print '\n'*3
            red.rpush(RESULTS_KEY, json.dumps(tupla_url))
#       debug
        #red.rpush(RESULTS_KEY, 'end')
        print "TANGO DOWN BRO, ALL CLEAR GJ!!"


if __name__ == "__main__":
     main()
