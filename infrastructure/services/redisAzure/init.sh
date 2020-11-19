curl -sSL https://get.docker.com/ | sh
# --name -> name Container befaas-redis 
# -d -> run detachted
# -p 6379:6379 -> expose port 
# -v redisData:/data -> share /data directory with redisData folder on host
# Set redis.conf values:
# --appendonly yes -> persistent storage
sudo docker run --name befaas-redis -v redisData:/data -p 6379:6379 -d redis redis-server --appendonly yes --requirepass "${random_string.redispass.result}"