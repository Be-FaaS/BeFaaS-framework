FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    ca-certificates \
    python3 \
    zip \
    jq \
    curl \
    xz-utils \
    git \
    openssh-client \
    apt-transport-https \
    lsb-release \
    gnupg \
  && rm -rf /var/lib/apt/lists/*

# install node
RUN curl -SLO https://nodejs.org/dist/v12.18.2/node-v12.18.2-linux-x64.tar.xz \
    && tar xJf node-v12.18.2-linux-x64.tar.xz -C /usr/local --strip-components=1 --no-same-owner \
    && rm node-v12.18.2-linux-x64.tar.xz \
    && node --version \
    && npm --version

# install awscli
RUN curl -SLO https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip \
    && unzip awscli-exe-linux-x86_64.zip \
    && ./aws/install \
    && rm -rf ./aws awscli-exe-linux-x86_64.zip \
    && aws --version

# install gcloud
RUN curl -SLO https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-301.0.0-linux-x86_64.tar.gz \
    && tar zxvf google-cloud-sdk-301.0.0-linux-x86_64.tar.gz google-cloud-sdk \
    && ./google-cloud-sdk/install.sh

ENV PATH="/google-cloud-sdk/bin:${PATH}"
RUN gcloud --version

# install azure-cli
RUN curl -SL https://aka.ms/InstallAzureCLIDeb | bash \
    && rm -rf /var/lib/apt/lists/* \
    && az --version

# install go
RUN curl -SLO https://golang.org/dl/go1.14.6.linux-amd64.tar.gz \
    && tar xvf go1.14.6.linux-amd64.tar.gz \
    && mv go /usr/local \
    && rm go1.14.6.linux-amd64.tar.gz

ENV PATH="/usr/local/go/bin:${PATH}"
RUN go version

# install openwhisk-cli
RUN curl -SLO https://github.com/apache/openwhisk-cli/releases/download/1.0.0/OpenWhisk_CLI-1.0.0-linux-amd64.tgz \
    && tar zxvf OpenWhisk_CLI-1.0.0-linux-amd64.tgz wsk \
    && mv wsk /usr/local/bin/ \
    && rm OpenWhisk_CLI-1.0.0-linux-amd64.tgz \
    && wsk --help

# install docker
RUN curl -SLO https://download.docker.com/linux/static/stable/x86_64/docker-19.03.12.tgz \
    && tar zxvf docker-19.03.12.tgz \
    && mv docker/docker /usr/local/bin/ \
    && rm -rf docker docker-19.03.12.tgz \
    && docker -v

# install terraform
RUN curl -SLO https://releases.hashicorp.com/terraform/0.12.28/terraform_0.12.28_linux_amd64.zip \
    && unzip terraform_0.12.28_linux_amd64.zip \
    && mv terraform /usr/local/bin/ \
    && rm terraform_0.12.28_linux_amd64.zip \
    && terraform version

RUN echo 'alias fmctl="npm run"' >> /root/.bashrc

WORKDIR /experiments

CMD ["/bin/bash"]
