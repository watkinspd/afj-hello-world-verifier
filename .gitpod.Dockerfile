FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /usr/app

RUN apt update -y && \
    apt install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/America/Pacific /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

RUN apt update -y && \
    apt install -y \
    software-properties-common \
    apt-transport-https \
    gnupg \
    ca-certificates \
    curl \
    build-essential \
    git

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt update -y && apt install -y nodejs

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88
RUN add-apt-repository "deb https://repo.sovrin.org/sdk/deb bionic stable"
RUN apt update -y
RUN apt install -y --allow-unauthenticated libindy

RUN npm install -g yarn

RUN yarn global add typescript

RUN yarn global add typescript

COPY ./tsconfig.json ./tsconfig.json
COPY ./package.json ./package.json

RUN yarn install

COPY ./src ./src

RUN yarn build

COPY ./views ./views
# Create the gitpod user. UID must be 33333.
RUN useradd -l -u 33333 -G sudo -md /home/gitpod -s /bin/bash -p gitpod gitpod
USER gitpod
CMD ["yarn","start:dev"]
EXPOSE 8020
EXPOSE 3000
