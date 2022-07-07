# pull official base image
FROM python:3.9

# set working directory
WORKDIR /app

# set environment variables

# Prevents Python from writing pyc files to disc (equivalent to python -B option)
ENV PYTHONDONTWRITEBYTECODE 1

# Prevents Python from buffering stdout and stderr (equivalent to python -u option)
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update \
  && apt-get -y install netcat gcc gnupg1 wget\
  && apt-get clean

RUN apt-get install -y libxml2-dev libxslt-dev python-dev


# install python dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# add app
COPY . .
 