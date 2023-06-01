# Misc

## TinyFaaS Setup

To install and start TinyFaaS (on aws instances), run thew following commands:

```
sudo yum install git -y
sudo yum install docker -y
sudo yum install curl -y
sudo service docker start
git clone https://github.com/Be-FaaS/tinyFaaS.git
cd tinyFaaS
sudo make
```

To install and start TinyFaaS (on Raspian), run thew following commands:

```
sudo apt-get install git -y
sudo apt-get install curl -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo service docker start
git clone https://github.com/Be-FaaS/tinyFaaS.git
cd tinyFaaS
sudo make start
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

curl --header "Content-Type: application/json" --header "X-Context: 123456" --header "X-Pair: 123-456" --request POST --data '{"event":{"order":"order_123456", "model":"B", "length":150, "height":50, "width":100, "type":"oak", "color":"coral", "hardness":2}, "fun":"orderSupplies"}' https://europe-west3-befaas.cloudfunctions.net/publisher/call



curl -X POST -d "{"subject": "Pudding", "data":{ "make": "Ducati", "model": "Monster"}}" https://function1.westeurope-1.eventgrid.azure.net/api/events

curl --header "Content-Type: application/json" --header "X-Context: 123789456" --header "X-Pair: 555-456" --request POST --data '{"title": "Herr ringe", "author":"Blabla", "duration":4500}'  https://ov41n3219b.execute-api.eu-central-1.amazonaws.com/dev/addVideo

curl --header "Content-Type: application/json" --header "X-Context: 123789456" --header "X-Pair: 555-456" --request POST --data '{"name": "Martin", "username":"martin", "password":"geheim123"}' https://e3kfte23wg.execute-api.eu-central-1.amazonaws.com/dev/registerUser

curl --header "Content-Type: application/json" --header "X-Context: 123789456" --header "X-Pair: 555-456" --request POST --data '{"deviceName": "Smartphone", "username":"martin", "password":"geheim123"}' https://e3kfte23wg.execute-api.eu-central-1.amazonaws.com/dev/registerDevice

curl --header "Content-Type: application/json" --header "X-Context: 123789456" --header "X-Pair: 555-456" --request GET --data '{"deviceId": "Herr ringe", "username":"Blabla", "password":4500}' https://e3kfte23wg.execute-api.eu-central-1.amazonaws.com/dev/authDevice

 curl --header "Content-Type: application/json" --header "X-Context: 123456" --header "X-Pair: 123-456" --request POST --data '{"event":{"name":"Pudding", "zucker":4}}, "fun":"function1"}' http://141.23.28.204:60008/publisher/call


```
