# BeFaaS

[![CI](https://github.com/Be-FaaS/BeFaaS-framework/workflows/CI/badge.svg)](https://github.com/Be-FaaS/BeFaaS-framework/actions?query=workflow%3ACI+branch%3Amaster)

BeFaaS is an extensible open-source benchmarking framework for FaaS environments which comes with two built-in benchmark suites and respective load profiles: An E-commererce application (web shop) and an IoT application (smart traffic light). BeFaas is the first benchmarking framework which enables the federated benchmark of FaaS providers: Users can split their application and define which function(s) should run on which provider. Currently, BeFaaS supports six FaaS providers on which (parts of) the test suite applications can be deployed and evaluated: 
* AWS Lambda
* Google Cloud Functions
* Azure Functions
* TinyFaaS
* OpenFaaS
* OpenWhisk

## Usage and Futher Information (for developers)
* [Initial provider setup](doc/providerSetup.md)
* [(Re-) run paper experiments](doc/experiments.md)
* [Detailed setup and configuration (adv.)](doc/details.md)
* [Add/Adjust functions or applications (adv.)](doc/functions.md)
* [Add/Adjust providers (adv.)](doc/providers.md)

## Reseach Paper

[BeFaaS: An Application-Centric Benchmarking Framework for FaaS Environments](https://www.google.com/search?q=BeFaaS%3A+An+Application-Centric+Benchmarking+Framework+for+FaaS+Environments).

If you use this software in a publication, please cite it as:

### Text
Martin Grambow, Tobias Pfandzelter, Luk Burchard, Carsten Schubert, Max Zhao, David Bermbach. **BeFaaS: An Application-Centric Benchmarking Framework for FaaS Environments**. In: Proceedings of $Conf name$. $Publisher$ $Year$.

### BibTeX
```TeX
@inproceedings{paper_grambow_befaas,
	title = {{BeFaaS: An Application-Centric Benchmarking Framework for FaaS Environments}},
	booktitle = {Proceedings of $Conf name$},
	publisher = {$Publisher$},
	author = {Martin Grambow, Tobias Pfandzelter, Luk Burchard, Carsten Schubert, Max Zhao, David Bermbach},
	year = {$YEAR$}
}
```

A full list of our [publications](https://www.mcc.tu-berlin.de/menue/forschung/publikationen/parameter/en/) and [prototypes](https://www.mcc.tu-berlin.de/menue/forschung/prototypes/parameter/en/) is available on our group website.


## Acknowledgment

We would like to thank Luk Burchard, Emily Dietrich, Carsten Schubert, Christoph Witzko, and Max Zhao who contributed to the implementation of our initial proof-of-concept prototype within the scope of a master’s [project](https://github.com/FaaSterMetrics) at TU Berlin.


## License 

The code in this repository is licensed under the terms of the [Apache 2.0](./LICENSE) license.