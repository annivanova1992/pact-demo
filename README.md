# pact-broker-example

### Prerequisites
- node (tested to work with v14)
- docker
- docker-compose

### Start Pact Broker
- docker-compose up --build -d

### Run Consumer CDC test
1. cd consumer
2. npm install
3. npm run cdc-test
4. change the version manually in package.json -> scripts -> publish-pacts
5. npm run publish-pacts

### Run Provider CDC test
1. cd provider
2. npm install
3. change PROVIDER_VERSION value in provider.pact.test.js
4. npm run cdc-test
5. provider verification results will be published to Pact Broker automatically

### Stop Pact Broker and Reset All Data
- docker-compose down --remove-orphans -v
