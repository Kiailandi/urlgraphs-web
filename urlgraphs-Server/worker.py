JOBS_KEY = 'jobs'

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
        # elaborazione
if __name__ == "__main__":
     main()
