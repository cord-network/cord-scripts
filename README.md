# Cord transaction anchoring scripts (for demonstration purposes)

## Requirements

* You are expected to have [`docker`](https://www.docker.com/) available to run the cord.network locally with developer mode.
* Have [`yarn`](https://yarnpkg.com/) installed and ready.
* Any web browser (which supports javascript) to check transactions on the CORD Chain.

## How to run the demo code (with staging network)

* Step 1: checkout/clone this repository.

* Step 2: install with `yarn install` once you are inside the repository.

* Step 3: You can watch the events and blocks finalization @ https://apps.cord.network/?rpc=wss%3A%2F%2Fregistries.demo.cord.network#/explorer

* Step 4: run the demo script with `NETWORK_ADDRESS=wss://registries.demo.cord.network yarn demo-statement1`. Understand whats happening by checking the code at `src/func-test_v9400.ts`.


## How to run the demo code (with local node)

* Step 1: checkout/clone this repository.

* Step 2: install with `yarn install` once you are inside the repository.

* Step 3: start the CORD Network in the developer mode (In another terminal)
  - `docker run --network host dhiway/cord:develop --dev`
  - Note that this exposes ports 9933/9944/30333
  - You can watch the events and blocks finalization @ https://apps.cord.network/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/explorer

* Step 4: run the demo script with `npx tsx src/func-test.ts`. Understand whats happening by checking the code at `src/func-test.ts`.

## How to run the demo code with DOCKER

* Step 1: checkout/clone this repository.

* Step 2: build image locally 
```sh
sudo docker build -t <docker-image-name> .
```
* Step 3: run docker image
  
i) Run demo on sparknet node
```sh
sudo docker run <docker-image-name> src/func-test.ts
```
  ii) Run demo on custom node
  ```sh 
sudo docker run --env NETWORK_ADDRESS='<network-address>' --env ANCHOR_URI='<anchor-uri>' <docker-image-name> src/func-test.ts
```
Example : `sudo docker run --env NETWORK_ADDRESS='ws://host.docker.internal:9944' --env ANCHOR_URI='//Alice' <docker-image-name> src/func-test.ts`

  -  Here values of `NETWORK_ADDRESS` and `ANCHOR_URI` can be changed according to your use case.


## What next from here?

* Understand the methods exposed from SDK by refering how `func-test.ts` and `network-score-test.ts` files are structured.

* You can refer our white paper for multiple usecases through https://cord.network

* To build on CORD chain, visit [cord project repo](https://github.com/dhiway/cord).
  - SDK development work is happening at [CORD.js repository](https://github.com/dhiway/cord.js)
  - SUBQL (Substrate's GraphQL update, which can help in organizing events and extrinsics happening on CORD chain) - [Repository](https://github.com/dhiway/cord-subql)

* Reach out to CORD community by joining [Discord](https://discord.gg/V8AqufZu)

