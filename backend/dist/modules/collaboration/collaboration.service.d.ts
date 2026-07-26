import { PrismaService } from '../../common/database/prisma.service';
import * as Y from 'yjs';
export declare class CollaborationService {
    private readonly prisma;
    private readonly logger;
    private activeDocs;
    constructor(prisma: PrismaService);
    loadDocument(documentId: string): Promise<Y.Doc>;
    handleUpdate(documentId: string, update: Uint8Array): Promise<void>;
    saveDocumentToDb(documentId: string): Promise<void>;
    saveVersionSnapshot(documentId: string, userId: string): Promise<void>;
    clearDocumentMemory(documentId: string): void;
}
