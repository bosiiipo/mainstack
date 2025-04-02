"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserTransactionLogSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balanceBefore: {
        type: Number,
        required: true,
        min: 0,
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    balanceAfter: {
        type: Number,
        required: true,
        min: 0,
    },
    transactionType: {
        type: String,
        enum: ["Credit", "Debit"],
        required: true,
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "NGN", "GBP"],
        default: "NGN",
        required: true,
    },
    status: {
        type: String,
        enum: ["successful", "failed", "pending"],
        required: true,
    },
    referenceId: {
        type: String,
        unique: true
    },
    walletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    recipientWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet"
    }
}, { timestamps: true });
const UserTransactionLog = mongoose_1.default.model('UserTransactionLog', UserTransactionLogSchema);
exports.default = UserTransactionLog;
//# sourceMappingURL=UserTransactionLog.js.map