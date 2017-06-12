# cns-server

- mongodb
- redis
- node-7
- yarn
- koa-2
- ava

### cms-admin

- vue-2
- nuxt
- element-ui

## Todo

- nuxt
- schedule
- logging
- upload
- role auth
- db model schema
- form validate
- redis cache
- transaction
- pm2
- cursor streaming

### Notes

- mongodb api now is promise based
- make sure koa-body@2 is installed against koa@2
- process.env.NODE_ENV is hard to control, we use config.env instead
- for better readability, we don't use standard RESTful api

### Usage

```sh
node tool/db-uninst
```

```sh
node tool/db-setup
```

```sh
npm start
# equivalent to
node tool/db-ensure
pm2 reload ecosystem.config.js
```
