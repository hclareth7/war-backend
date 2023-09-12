# How to set up this project in your local

##### Install nvm to manage nodejs versions


##### Install this node version (lts/* -> lts/hydrogen (-> v18.17.0))

##### Clone the git project

`git clone git@github.com:hclareth7/war-backend.git`

##### Install node dependencies

`npm i`

### Copy the .env file with the configurations

```
#APP
APP_LOG_LEVEL=dev
APP_API_PATH="/api"
APP_PORT=3000
APP_ALLOWED_ORIGINS="*"

#S3 CONF
S3_CLOUD_ENDPOINT=
S3_COUD_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
BUCKET_NAME=test_war_backups

#DB
MONGODB_URL=
JWT_KEY=
```

### Run the project

`npm run dev`

### Access to the doc API

follow this link: http://localhost:3000/doc


## How to manage the development workflow

### Create a branch according to TaskID and task title

Make sure that to run this command you are in the main branch updated.
`git checkout -b TaskID-Task title`

example: `git checkout -b OjTlw6W9-arreglar-readme-backend`
