import { dbTest } from '../sql/db'

/*
PLEASE BEFORE RUN THIS FILE, CREATE A DATABASE NAMED "biliratest"
*/

const runSetup: () => void = async () => {
  await dbTest.query(
    '\
    DROP TABLE IF EXISTS Swaps;\
    CREATE TABLE Swaps(\
    uuid CHAR(36) NOT NULL, \
    fromAddress VARCHAR(64), \
    toAddress VARCHAR(64), \
    amount VARCHAR(32), \
    depositAddress TEXT, \
    deposit_transaction_hash TEXT [], \
    transfer_transaction_hash TEXT, \
    fromNetwork TEXT, \
    toNetwork TEXT, \
    status VARCHAR(32), \
    created TIMESTAMP, \
    PRIMARY KEY (uuid));\
    ',
  )
}

runSetup()
