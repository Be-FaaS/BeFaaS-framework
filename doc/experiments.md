# (Re-) Run Experiments

Follow the next steps to (re-) run the paper experiments:

## Setup

1. To run benchmarks, BeFaaS requires programmatic access to the respective platforms. So the first step is to create access keys for the respective platforms, see [Initial provider setup](providerSetup.md). 
2. BeFaas also requires some managaing instance to orchestrate the benchmark run (Benchmark Manager). This can either be your local computer or a cloud instance. For simplicity, we limit this description to running the benchmark on an AWS EC2 cloud instance (see [Detailed setup and configuration (adv.)](details.md) if you want to use your own computer as Benchmark Manager).
	1. **Create an AWS EC2-Instance** and connect to it. The orchestration of the benchmark itself requires only a few resources, but the logs can contain several GB of data, depending on the size of the application and the duration of the experiment. We therefore recommend an **t3.medium** instance (Amazon Linux 2 AMI (HVM), SSD Volume Type, x86). 
	2. Install the following dependencies:
		```
		sudo yum install git -y
		sudo yum install docker -y 
		sudo yum install -y 
		sudo yum install gcc -y 
		sudo yum install openssl-devel -y 
		sudo yum install bzip2-devel -y 
		sudo yum install libffi-devel -y
		sudo wget https://www.python.org/ftp/python/3.8.1/Python-3.8.1.tgz
		sudo tar xzf Python-3.8.1.tgz
		cd Python-3.8.1/
		sudo ./configure --enable-optimizations
		sudo make altinstall
		```
	3. (Opt.) **Copy provider keys** to EC2 instance
	4. Adjust .bashrc and **set environment variables** (check cloud regions)
		Example:
		```
		export AWS_ACCESS_KEY_ID=AAAAAA333333OOOOOBBBB
		export AWS_SECRET_ACCESS_KEY=xxxxxxxyyyyyyyyyyyzzzzzzzzyyyyyxxxxxxxxx
		export AWS_REGION=eu-west-1
		
		#Google:
		export GOOGLE_APPLICATION_CREDENTIALS=<path/to/privatekey.json>
		export GOOGLE_PROJECT=<project_id>
		export GOOGLE_REGION=<region e.g. us-east1>
		
		#AWS:
		export AWS_ACCESS_KEY_ID=<access_key>
		export AWS_SECRET_ACCESS_KEY=<secret_access_key>
		export AWS_REGION=<region e.g. us-east-1>
		
		#Azure:
		export ARM_TENANT_ID=<tenantId from az account list>
		export ARM_SUBSCRIPTION_ID=<id from az account list>
		
		#tinyFaaS:
		TINYFAAS_ADDRESS=<Public Adress of your tinyFaaS instance>
		
		#OPENFAAS:
		export OPENFAAS_GATEWAY=http://<address of openfaas gateway>:8080
		export OPENFAAS_TOKEN=<password for openfaas, the one you also use when logging into faas-cli>
		
		#OpenWhisk:
		export OPENWHISK_EXTERNAL=<address of openwhisk api gateway>
		```
	5. **Restart terminal** to export the environment variables 


## Run

1. **Start Docker**
	```
	sudo service docker start
	```	
2. **Clone BeFaaS-framwork repository**
	```
	git clone https://github.com/Be-FaaS/BeFaaS-framework.git
	```
3. **Adjust deployment file** in the respective experiment folder (webserivce or iot)

	Adjust the experiment.json. The default configuration of the webservice application uses AWS and Google Cloud.
	
4. **Build Docker container**
	```
	sudo docker build -t befaas/framework BeFaaS-framework/docker/
	```
5. **Start framework** service
	```
	sudo -E ./BeFaaS-framework/docker/run.sh
	```
	(-E = Preserve Environments - to transfer the environment variables to the docker container)
	
	The shell now opens a new instance in the container and you can type your BeFaaS commands

6. Comment line 26 (command -v faas-cli ...) in scripts/build.sh (Here's a small bug)
6. **Build experiment** (webservice or iot), see folder experiments/
	```
	npm run build webservice
	```
	Runs the Deployment Compiler.
7. **Deploy experiment**
	```
	npm run deploy webservice
	```
	Deploys artifacs to the respective providers. 
	
8. **Trigger Workload generation**
	```
	fmctl workload webservice
	```
	Starts the benchmark run. 
9. **Wait** for experiment to complete ... 
10. **Get log files** from used providers
	```
	npm run logs webservice
	```
	All the log are now on your managing instance, see BeFaaS-framework/logs/webservice/<datetime>.
11. **Destroy** everything
	```
	npm run destroy
	```
	This clears all allocated resources. 
12. **Exit framework container**
	```
	exit
	```


## Evaluation

Tools for analyzing and exporting experiment results are within the [analysis repository](https://github.com/Be-FaaS/BeFaaS-analysis).

The next steps assume that you've just collected the logs on a managing AWS EC2 instance and want to evaluate them. For more information regaring the evaluation capabilities, please swich to the [analysis repository](https://github.com/Be-FaaS/BeFaaS-analysis) documentation.

1. **Clone BeFaaS-analysis repository**
	```
	git clone https://github.com/Be-FaaS/BeFaaS-analysis.git
	```
2. **Build Docker container**
	```
	sudo docker build -t befaas/analysis BeFaaS-analysis/
	```
3. **Move log files** from experiment folder run to a new results folder
	```
	mkdir results
	sudo mv BeFaaS-framework/logs/webservice/<datetime> results/logs
	```
	
4. **Run analysis**
	```
	sudo docker run -it -v `pwd`/results:/analysis/results befaas/analysis results/logs results/
	```