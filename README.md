# V Protocol

A website clone that mimics the functionality of [Tinder Recommendation](https://v-protocol.vercel.app/).

[Frontend](/tinder-clone/) built using:

- ReactJS (Typescript)
- TailwindCSS

and deployed using Vercel.

Backend built using:

- NodeJS
- [Express](/aws-api/src/app.js)

and deployed using AWS Services in [aws-api folder](/aws-api) template by running `npm run setup` for initial deployment and running `npm run package-deploy` for subsequent deployments.

[api-test](/api-test/) is used to test the backend locally before deployment.

Database setup using:

- AWS RDS
- PostgreSQL

Database is populated using [dummy data](/tinder-clone/src/lib/dummy-data.js) generated by ChatGPT. 

To repopulate data, run script:

```
cd tinder-clone
npm run seed
```# virtual_protocol
