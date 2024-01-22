import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { LoggerService } from './logging.service';
@Injectable()
export class MongoAuditService {
    private readonly mongoClient: MongoClient;
    /**
     * Constructor for the MongoAuditService class.
     * Sets up a MongoDB client and initializes change streams for specified collections.
     * @param logger LoggerService instance for logging purposes.
     */
    constructor(private readonly logger: LoggerService) {
        this.mongoClient = new MongoClient(process.env.DATABASE_URL);

        this.mongoClient.connect().then(() => {
            const collectionsToAudit = [
                //  { name: 'members', auditName: 'members_audit' },
                { name: 'visits', auditName: 'visits_audit' },
            ];

            collectionsToAudit.forEach(({ name, auditName }) => {
                const collectionToAudit = this.mongoClient
                    .db(process.env.MONGO_DB_NAME)
                    .collection(name);

                const changeStream = collectionToAudit.watch();

                changeStream.on('change', (change) => {
                    const auditCollection = this.mongoClient
                        .db(process.env.MONGO_DB_NAME)
                        .collection(auditName);

                    const auditLog: any = {
                        timestamp: new Date(),
                        operationType: change.operationType,
                    };

                    if ('documentKey' in change) {
                        auditLog.documentKey = change.documentKey;
                    }
                    if (change.operationType === 'update') {
                        auditLog.updatedFields = change.updateDescription.updatedFields;
                    }
                    auditCollection.insertOne(auditLog).then(() => {

                    }).catch((error) => {
                        console.error('Error inserting audit log:', error);
                    });
                });
            });
        });
    }

    /**
     * Logs an event to the specified audit collection.
     * @param collectionName The name of the collection.
     * @param operationType The type of operation.
     * @param requestId The request ID.
     * @param id The ID of the document.
     * @returns A promise that resolves when the log event has been inserted into the audit collection.
     */
    async logEvent(collectionName: string, operationType: string, requestId: any, id: any): Promise<void> {
        // Check if collectionName is not null or empty
        if (collectionName && collectionName.trim() !== '') {
            const auditCollection = this.mongoClient
                .db(process.env.MONGO_DB_NAME)
                .collection(`${collectionName}_audit`);

            const auditLog = {
                timestamp: new Date(),
                operationType,
                requestId,
                id,
            };

            // Insert the audit log into the audit collection
            await auditCollection.insertOne(auditLog);
        }
    }
}