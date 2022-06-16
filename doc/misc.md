# Misc

## TinyFaaS Setup

To install and start TinyFaaS, run thew following commands:

```
sudo yum install git -y
sudo yum install docker -y
sudo yum install curl -y
sudo service docker start
git clone https://github.com/Be-FaaS/tinyFaaS.git
cd tinyFaaS
sudo make
```

## Debug Redis entries

Install redis-cli:

```
sudo yum install -y gcc
wget http://download.redis.io/redis-stable.tar.gz && tar xvzf redis-stable.tar.gz && cd redis-stable && make
sudo cp src/redis-cli /usr/bin/
```

Get a list of all keys:

```
redis-cli -h 12.12.12.12
auth <yourpassword>
KEYS *
GET <keyname>
```

## Debug function calls

```
curl --header "Content-Type: application/json" --header "X-Context: 112244" --header "X-Pair: 456-456" --request POST --data '{"event":{"username":"xyz","password":"tobias"}, "fun":"function1"}' https://befaas-7jlojluezomcm262.azurewebsites.net/api/publisher/call


curl --header "Content-Type: application/json" --header "X-Context: 123456" --header "X-Pair: 123-456" --request POST --data '{"event":{"carDirection":{"plate":"OD DI 98231", "direction":4, "speed":10}}, "fun":"trafficsensorfilter"}' https://xb3b4huvz6.execute-api.eu-central-1.amazonaws.com/dev/publisher/call





curl -X POST -d "{"subject": "Pudding", "data":{ "make": "Ducati", "model": "Monster"}}" https://function1.westeurope-1.eventgrid.azure.net/api/events
```
