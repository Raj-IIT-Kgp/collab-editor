import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import * as Y from 'yjs';

@Injectable()
export class CollaborationService {
  private readonly logger = new Logger(CollaborationService.name);
  
  // In a robust production environment, you might keep active Y.Docs in memory
  // here or in a Redis cache instead of fetching per update, but for stateless
  // horizonal scaling, pulling and applying state works, albeit heavier on DB.
  private activeDocs: Map<string, Y.Doc> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async loadDocument(documentId: string): Promise<Y.Doc> {
    if (this.activeDocs.has(documentId)) {
      return this.activeDocs.get(documentId)!;
    }

    const docRecord = await this.prisma.document.findUnique({ where: { id: documentId } });
    const ydoc = new Y.Doc();
    if (docRecord?.content) {
      Y.applyUpdate(ydoc, new Uint8Array(docRecord.content));
    }
    
    this.activeDocs.set(documentId, ydoc);
    return ydoc;
  }

  async handleUpdate(documentId: string, update: Uint8Array) {
    const ydoc = await this.loadDocument(documentId);
    Y.applyUpdate(ydoc, update);
  }

  async saveDocumentToDb(documentId: string) {
    const ydoc = this.activeDocs.get(documentId);
    if (!ydoc) return;

    const fullState = Y.encodeStateAsUpdate(ydoc);
    
    await this.prisma.document.update({
      where: { id: documentId },
      data: { content: Buffer.from(fullState) },
    });
  }

  async saveVersionSnapshot(documentId: string, userId: string) {
    const ydoc = this.activeDocs.get(documentId);
    if (!ydoc) return;

    const fullState = Y.encodeStateAsUpdate(ydoc);
    await this.prisma.documentVersion.create({
      data: {
        documentId,
        snapshot: Buffer.from(fullState),
        userId,
      },
    });
  }
  
  clearDocumentMemory(documentId: string) {
    this.activeDocs.delete(documentId);
  }
}
