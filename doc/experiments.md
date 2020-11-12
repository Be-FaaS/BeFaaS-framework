# (Re-) Run Experiments

Follow the next steps to (re-) run the paper experiments:

## Setup

1. To run benchmarks, BeFaaS requires programmatic access to the respective platforms. So the first step is to create access keys for the respective platforms, see [Initial provider setup](doc/providerSetup.md). 
2. BeFaas also requires some managaing instance to orchestrate the benchmark run (Benchmark Manager). This can either be your local computer or a cloud instance. For simplicity, we limit this description to running the benchmark on an AWS EC2 cloud instance (see [Detailed setup and configuration (adv.)](doc/details.md) if you want to use your own computer as Benchmark Manager).
	1. **Create an AWS EC2-Instance** and connect to it. The orchestration of the benchmark itself requires only a few resources, but the logs can contain several GB of data, depending on the size of the application and the duration of the experiment. We therefore recommend an **m3.medium** instance. 
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
	3. **Copy provider keys** to EC2 instance
	4. Adjust .bashrc and **set environment variables** (check cloud regions)
		Example:
		```
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
2. **Clone BeFaaS-framwork repository** (finally)
	```
	git clone https://github.com/Be-FaaS/BeFaaS-framework.git
	```
3. **Start framework** service
	```
	sudo -E ./experiments/docker/run.sh
	```
	(-E = Preserve Environments - to transfer the environment variables to the docker container)
4. **Build experiment** (webservice or iot), see folder experiments/
	```
	npm run build webservice
	```
	Runs the Deployment Compiler.
5. **Deploy experiment**
	```
	npm run deploy webservice
	```
	Deploys artifacs to the respective providers. 
6. **Trigger Workload generation**
	```
	fmctl workload webservice
	```
	Starts the benchmark run. 
7. **Wait** for experiment to complete ... 
8. **Get log files** from used providers
	```
	npm run logs webservice
	```
	All the log are now on your managing instance ().
9. **Destroy** everything
	```
	npm run destroy
	```
	This clears allallocated resources. 


## Evaluation

Tools for analyzing and exporting experiment results are within the [analysis repository](https://github.com/Be-FaaS/BeFaaS-analysis).