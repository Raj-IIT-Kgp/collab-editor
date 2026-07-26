"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CollaborationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaborationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const Y = require("yjs");
let CollaborationService = CollaborationService_1 = class CollaborationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CollaborationService_1.name);
        this.activeDocs = new Map();
    }
    async loadDocument(documentId) {
        if (this.activeDocs.has(documentId)) {
            return this.activeDocs.get(documentId);
        }
        const docRecord = await this.prisma.document.findUnique({ where: { id: documentId } });
        const ydoc = new Y.Doc();
        if (docRecord?.content) {
            Y.applyUpdate(ydoc, new Uint8Array(docRecord.content));
        }
        this.activeDocs.set(documentId, ydoc);
        return ydoc;
    }
    async handleUpdate(documentId, update) {
        const ydoc = await this.loadDocument(documentId);
        Y.applyUpdate(ydoc, update);
    }
    async saveDocumentToDb(documentId) {
        const ydoc = this.activeDocs.get(documentId);
        if (!ydoc)
            return;
        const fullState = Y.encodeStateAsUpdate(ydoc);
        await this.prisma.document.update({
            where: { id: documentId },
            data: { content: Buffer.from(fullState) },
        });
    }
    async saveVersionSnapshot(documentId, userId) {
        const ydoc = this.activeDocs.get(documentId);
        if (!ydoc)
            return;
        const fullState = Y.encodeStateAsUpdate(ydoc);
        await this.prisma.documentVersion.create({
            data: {
                documentId,
                snapshot: Buffer.from(fullState),
                userId,
            },
        });
    }
    clearDocumentMemory(documentId) {
        this.activeDocs.delete(documentId);
    }
};
exports.CollaborationService = CollaborationService;
exports.CollaborationService = CollaborationService = CollaborationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollaborationService);
//# sourceMappingURL=collaboration.service.js.map