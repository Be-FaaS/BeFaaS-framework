FROM node:12-alpine

RUN npm i -g artillery@1 --allow-root --unsafe-perm=true

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
