import {
  mysql as mysqlCred,
  braintree as braintreeCred,
  aws as awsCred,
  sailthru as sailthruCred,
  netsuite as netsuiteCred,
  kraken as krakenCred,
  facebook as facebookCred
} from "./credentials";

// Please don't delete the database host parameters
// They're not secret, and the reason we have two template files
export const mysqlConfig = {
  poolCluster: {
    canRetry: true,
    removeNodeErrorCount: 3,
    restoreNodeTimeout: 60 * 1000,
    defaultSelector: 'ORDER'
  },
  root_pool: {
    host: 'xavier-prod-cluster.cluster-c17ujtdunkub.us-east-1.rds.amazonaws.com',
    user: mysqlCred.root.username,
    password: mysqlCred.root.password,
    database: 'xavier',
    multipleStatements: true
  },
  write_pool: {
    connectionLimit: 10,
    host: 'xavier-prod-cluster.cluster-c17ujtdunkub.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'xavier',
    user: mysqlCred.write_user.username,
    password: mysqlCred.write_user.password
  },
  read_pool_a: {
    connectionLimit: 40,
    host: 'xavier-prod-cluster.cluster-c17ujtdunkub.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'xavier',
    user: mysqlCred.read_user.username,
    password: mysqlCred.read_user.password
  },
  read_pool_b: {
    connectionLimit: 50,
    host: 'xavier-prod-us-east-1b.c17ujtdunkub.us-east-1.rds.amazonaws.com',
    port: 3306,
    database: 'Xavier',
    user: mysqlCred.read_user.username,
    password: mysqlCred.read_user.password
  }
};

export const braintreeConfig = {
  env: "Production",
  merchantId: braintreeCred.merchantId,
  publicKey: braintreeCred.publicKey,
  privateKey: braintreeCred.privateKey,
  cseKey: braintreeCred.cseKey
};

export const awsConfig = {
  //region is different for some services in aws... repetition here is for flexibility
  region: 'us-east-1',  //@TODO check/delete later
  zone: 'A', //@TODO check/delete later
  s3: {
    accessKeyId: awsCred.accessKeyId,
    secretAccessKey: awsCred.secretAccessKey,
    region: "us-east-1"
  },
  ses: {
    accessKeyId: awsCred.accessKeyId,
    secretAccessKey: awsCred.secretAccessKey,
    region: "us-east-1",
    enable: true
  },
  sqs: {
    accessKeyId: awsCred.accessKeyId,
    secretAccessKey: awsCred.secretAccessKey,
    region: "us-east-1",
    queues: {
      enrollment: "https://sqs.us-east-1.amazonaws.com/963078709700/X2N-Enrollment",
      invoice: "https://sqs.us-east-1.amazonaws.com/963078709700/X2N-Invoice",
      member: "https://sqs.us-east-1.amazonaws.com/963078709700/X2N-Member",
      giftRedeem: "https://sqs.us-east-1.amazonaws.com/963078709700/X2N-Gift-Redeem",
      giftPurchase: "https://sqs.us-east-1.amazonaws.com/963078709700/X2N-Gift-Purchase"
    }
  }
};

export const sailthruConfig = {
  BOM: {
    apiKey: sailthruCred.apiKey,
    apiSecret: sailthruCred.apiSecret,
    enable: true,
    lists: {
      main: "BOTMContactList",
      leads: "botm_leads"
    }
  }
};

export const netsuiteConfig = {
  loginKey: netsuiteCred.loginKey
};

export const krakenConfig = { //kraken settings must be snake_case
  api_key: krakenCred.apiKey,
  api_secret: krakenCred.apiSecret
};

export const facebookConfig = {
  id: "747808595305760",
  secret: facebookCred.secret,
  accessToken: facebookCred.accessToken
};
