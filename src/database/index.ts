import mongoose, { ClientSession, Connection } from 'mongoose';
import {MongoClient} from 'mongodb';
import {config} from '../config';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectMongoose = async () => {
  try {
    let mongoMockServer = await MongoMemoryServer.create();
    const uri = mongoMockServer.getUri();
    let databaseURL = process.env.NODE_ENV !== "test" ? config.databaseUrl! : uri; 
    await mongoose.connect(databaseURL);
    console.log('mongoose.js: ' + 'Successfully connected to mongo database!!');
  } catch (error) {
    console.log(error);
  }
};

// const maxWriteConflictRetry = 2;
// let retry = 0;

// export const dbTransaction = async <T>(
//   connection: Connection,
//   cb: (session: ClientSession) => Promise<T>,
// ): Promise<T> => {
//   const session = await connection.startSession();
//   try {
//     console.log("START SESSION")
//     session.startTransaction();
//     console.log("START TRANSSSAS;CK")

//     const result = await cb(session);
//     console.log({result})

//     await session.commitTransaction();
//     console.log("AFTRE COMIT")

//     return result;
//   } catch (err: any) {
//     await session.abortTransaction();
//     console.error('db_transaction_error', JSON.stringify(err));
//     if (err instanceof mongoose.mongo.MongoError) {
//       switch (err.code) {
//         case 8: //unknown error
//         case 112: //WriteConflict
//         case 117: {
//           //ConflictingOperationInProgress
//           //retying for write conflicts and unknown errors
//           if (retry <= maxWriteConflictRetry) {
//             ++retry;
//             console.error('db_transaction_error_retry');
//             return dbTransaction(connection, cb);
//           }
//           throw new UnprocessableEntityException('Unable to process transaction, please try again');
//         }

//         case 11000: {
//           //unique constraint error
//           throw new UnprocessableEntityException(
//             'Duplicate reference detected, please try again with a new reference',
//           );
//         }
//         //unexpected error, client to treat as pending
//         default: {
//           throw new InternalError('Unexpected error occurred', err);
//         }
//       }
//     }

//     throw err;
//   } finally {
//     await session.endSession();
//   }
// };

export const client = new MongoClient(config.databaseUrl!);



