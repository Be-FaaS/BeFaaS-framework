#!/bin/bash

if ! [ -f ".suppress_notice" ]; then
    echo "
If you use this software (or parts of it) in a published work, please include a citation similar to the following BibTex notice. 
We will update this entry once we have finished a complete software documentation for our work."
    echo -e "
\e[90m@Manual{faasterMetrics2020,
  title = {FaaSter Metrics: An Application-oriented Function as a Service Benchmarking Framework},
  author = {Burchard, Luk and Schubert, Carsten and Witzko, Christoph and Zhao, Max and Dietrich, Emily},
  organization = {FaaSter Metrics project group},
  address = {Berlin, Germany},
  year = {2020},
  url = {https://github.com/FaaSterMetrics},
}\e[39m
"
    echo -e "To locally supress this notice please run  
$ \e[32mtouch \"$PWD/.suppress_notice\"\e[39m
"
fi