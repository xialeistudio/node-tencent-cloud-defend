"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const index_1 = require("../index");
describe("test tlv", () => {
    it("encode '1'", () => __awaiter(this, void 0, void 0, function* () {
        should(index_1.Tlv.encode(1, "1")).equal("AAAAAQAAAAEx");
    }));
    it("encode '天气不错'", () => __awaiter(this, void 0, void 0, function* () {
        should(index_1.Tlv.encode(1, "天气不错")).equal("AAAAAQAAAAzlpKnmsJTkuI3plJk=");
    }));
    it("decode '1'", () => __awaiter(this, void 0, void 0, function* () {
        const ret = index_1.Tlv.decode("AAAAAQAAAAEx");
        should(ret[0]).equal(1);
        should(ret[1]).equal("1");
    }));
    it("decode '天气不错'", () => __awaiter(this, void 0, void 0, function* () {
        const ret = index_1.Tlv.decode("AAAAAQAAAAzlpKnmsJTkuI3plJk=");
        should(ret[0]).equal(1);
        should(ret[1]).equal("天气不错");
    }));
});
describe("test tencentDefent", () => {
    it("test UgcAntiSpam", () => __awaiter(this, void 0, void 0, function* () {
        if (!process.env.SECRETID || !process.env.SECRETKEY) {
            throw new Error("请配置secretId和secretKey");
        }
        const tencentDefend = new index_1.TencentCloudDefend(process.env.SECRETID, process.env.SECRETKEY);
        const args = {
            accountType: 0,
            messageId: Date.now(),
            messageStruct: index_1.Tlv.encode(1, "bao夜①ooo_聅糸電诂【１3１&****&****】"),
            postIp: "127.0.0.1",
            uid: 1,
        };
        const data = yield tencentDefend.request("GET", "UgcAntiSpam", args);
        should(data).hasOwnProperty("code", "响应码");
        should(data).hasOwnProperty("level", "恶意等级");
        should(data).hasOwnProperty("type", "系统命中关键词类别");
    }));
});
//# sourceMappingURL=index.js.map