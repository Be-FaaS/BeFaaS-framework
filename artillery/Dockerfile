FROM node:20-alpine

RUN npm i -g artillery@2.0.0-31 --allow-root --unsafe-perm=true

WORKDIR /workload

ENV PROCESSOR_DIR /workload
# ADD logger.js ./
ADD build/index.js ./logger.js

ADD run.sh ./
ADD variables.json ./
ADD workload.yml ./
ADD usernames.csv ./
ADD image-ambulance.jpg ./
ADD image-noambulance.jpg ./

CMD ["/workload/run.sh"]
