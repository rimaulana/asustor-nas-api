# ASUSTOR NAS Rest API

[![CircleCI](https://img.shields.io/circleci/project/github/rimaulana/asustor-nas-api.svg)](https://circleci.com/gh/rimaulana/asustor-nas-api/tree/master) [![codecov](https://codecov.io/gh/rimaulana/asustor-nas-api/branch/master/graph/badge.svg)](https://codecov.io/gh/rimaulana/asustor-nas-api) [![codebeat badge](https://codebeat.co/badges/dcef7362-7fc7-4c3d-bed7-97c28f22f7f7)](https://codebeat.co/projects/github-com-rimaulana-asustor-nas-api-master) [![Maintainability](https://api.codeclimate.com/v1/badges/9404c62584bd01ddfd59/maintainability)](https://codeclimate.com/github/rimaulana/asustor-nas-api/maintainability) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Expose ASUSTOR NAS functionality via REST API. This application was develop as a part of VMware VM backup automation system that help create backup destination folder on NAS storage and backup from NAS storage into USB drives. The documentation for this API can be found [here](https://app.swaggerhub.com/apis/rimaulana/asustor-nas-api/1.0.0)

## Table of Contents
- [Limitations](#Limitations)
- [Installation](#Installation)
- [Configuration File](#Configuration-File)
    - [api_keys](#api_keys-Mandatory-)
    - [server_port](#server_port-Optional-)
    - [slack_webhook](#slack_webhook-Optional-)
- [Running the Service](#Running-the-Service)
- [API Documentation](https://app.swaggerhub.com/apis/rimaulana/asustor-nas-api/1.0.0)

## Limitations
* Currently doesn't support HTTPS
* Only support API Key authentication

## Installation

To install this application, the following requirements needs to be met
* Node.js ^6.9.1
* npm ^3.10.8
* internet connection

once all the requirements are met, you can clone this repository using the following command
```bash
git clone https://github.com/rimaulana/asustor-nas-api.git
```
If you don't have git on your system, you can also get the files by downloading the latest release on our [release page](https://github.com/rimaulana/asustor-nas-api/releases), then extract it.

once the codes were downloaded, cd into asustor-nas-api directory and then run

```bash
npm install --only=prod
```

## Configuration File
All application configurations are saved in application root folder and should be named **config.json** which by default doesn't exist. You need to create this file in order for this application to work. Below is the example of **config.json** file
```json
{
    "api_keys": [
        "key1","key2","key3"
    ],
    "server_port": 3000,
    "slack_webhook": "webhook_code"
}
```
### api_keys (**mandatory**)
This array is a collections of allowed API keys used to authenticate a request.
### server_port (**optional**)
By default application will use port 3000 unless you say otherwise on this section. All optional settings doesn't need to be declared when it is not used
### slack_webhook (**optional**)
Integration with slack where application loggin will be sent to slack. More information regarding slack incoming webhook can be read over [here](https://api.slack.com/incoming-webhooks). All optional settings doesn't need to be declared when it is not used

## Running the service

To run the service simply run

```bash
npm run server
```
