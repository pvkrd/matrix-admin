"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = __importStar(require("../lib/azure-cosmosdb-mongodb"));
const httpTrigger = function (context, req) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let response = null;
            // create 1 db connection for all functions
            yield db.init();
            switch (req.method) {
                case "GET":
                    if ((req === null || req === void 0 ? void 0 : req.query.id) || ((req === null || req === void 0 ? void 0 : req.body) && ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.id))) {
                        response = {
                            documentResponse: yield db.findItemById((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.id),
                        };
                    }
                    else {
                        // allows empty query to return all items
                        const dbQuery = ((_c = req === null || req === void 0 ? void 0 : req.query) === null || _c === void 0 ? void 0 : _c.dbQuery) || ((req === null || req === void 0 ? void 0 : req.body) && ((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.dbQuery));
                        response = {
                            documentResponse: yield db.findItems(dbQuery),
                        };
                    }
                    break;
                case "POST":
                    if ((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.document) {
                        const insertOneResponse = yield db.addItem((_f = req === null || req === void 0 ? void 0 : req.body) === null || _f === void 0 ? void 0 : _f.document);
                        response = {
                            documentResponse: insertOneResponse,
                        };
                    }
                    else {
                        throw Error("No document found");
                    }
                    break;
                case "DELETE":
                    if (((_g = req === null || req === void 0 ? void 0 : req.query) === null || _g === void 0 ? void 0 : _g.id) || ((req === null || req === void 0 ? void 0 : req.body) && ((_h = req === null || req === void 0 ? void 0 : req.body) === null || _h === void 0 ? void 0 : _h.id))) {
                        response = {
                            documentResponse: yield db.deleteItemById((_j = req === null || req === void 0 ? void 0 : req.body) === null || _j === void 0 ? void 0 : _j.id),
                        };
                    }
                    else {
                        throw Error("No id found");
                    }
                    break;
                default:
                    throw Error(`${req.method} not allowed`);
            }
            context.res = {
                body: response,
            };
        }
        catch (err) {
            context.log(`*** Error throw: ${JSON.stringify(err)}`);
            context.res = {
                status: 500,
                body: err,
            };
        }
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map