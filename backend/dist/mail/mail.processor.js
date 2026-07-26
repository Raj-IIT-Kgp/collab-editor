"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MailProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let MailProcessor = MailProcessor_1 = class MailProcessor extends bullmq_1.WorkerHost {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger(MailProcessor_1.name);
    }
    async process(job) {
        switch (job.name) {
            case 'verification-email':
                this.logger.log(`Sending verification email to ${job.data.email} with token ${job.data.token}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                break;
            case 'password-reset-email':
                this.logger.log(`Sending password reset email to ${job.data.email} with token ${job.data.token}`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                break;
            default:
                this.logger.warn(`Unknown job name: ${job.name}`);
        }
    }
};
exports.MailProcessor = MailProcessor;
exports.MailProcessor = MailProcessor = MailProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('mail')
], MailProcessor);
//# sourceMappingURL=mail.processor.js.map