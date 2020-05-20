# E-Commerce Demo Application (Webservice)

This part of the project is a collection of deployable functions which together build a mockup webshop application.
Representing real-life workload conditions, this demo is mainly used for the purpose of benchmarking said FaaS elements on various (configurable) platforms.
Of course, it may also be understood as a basic idea of how a webservice can be designed in a serverless model.

The functionality itself is closely oriented on [Google's microservice demo v0.1.0](https://github.com/GoogleCloudPlatform/microservices-demo/tree/bae651f7ea537d2676b38a04d89adacdd45c17bd).
We used their design as a template of how different services of a webshop can interact with each other. 
Naturally, the services itselves were fully reimplemented to fit the FaaS setting.
