FROM node:12-alpine

RUN npm i -g artillery@1 --allow-root --unsafe-perm=true

WORKDIR /workload

ENV PROCESSOR_DIR /workload
ADD logger.js ./

ADD run.sh ./
ADD variables.json ./
ADD workload.yml ./

CMD ["/workload/run.sh"]
