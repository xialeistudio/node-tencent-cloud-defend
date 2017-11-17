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
const crypto = require("crypto");
const node_fetch_1 = require("node-fetch");
class TencentCloudDefend {
    constructor(secretId, secretKey, regionId = "gz", url = "csec.api.qcloud.com/v2/index.php") {
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.regionId = regionId;
        this.url = url;
    }
    request(method, action, args, timeout = 2000) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.makeUrl(method, action, args);
            const res = yield node_fetch_1.default(url, { timeout });
            return res.json();
        });
    }
    makeUrl(method, action, args) {
        args.Nonce = Math.floor(Math.random() * 1000000);
        args.Action = action;
        args.Region = this.regionId;
        args.SecretId = this.secretId;
        args.Timestamp = parseInt((Date.now() / 1000).toString(), 10);
        args.Signature = this.makeSign(method, args);
        return `https://${this.url}?${this.makeQueryString(args, true)}`;
    }
    makeSign(method, args) {
        return this.hmacSha1(`${method}${this.url}?${this.makeQueryString(args, false)}`);
    }
    makeQueryString(args, encoded) {
        const keys = Object.keys(args).sort();
        const params = [];
        keys.forEach((key) => {
            if (encoded) {
                params.push(`${key}=${encodeURIComponent(args[key])}`);
            }
            else {
                params.push(`${key}=${args[key]}`);
            }
        });
        return params.join("&");
    }
    hmacSha1(data) {
        const hash = crypto.createHmac("sha1", this.secretKey);
        hash.update(data);
        return hash.digest("base64");
    }
}
exports.TencentCloudDefend = TencentCloudDefend;
class Tlv {
    static decode(str) {
        const buf = new Buffer(str, "base64");
        const type = buf.readIntBE(0, 4);
        const length = buf.readIntBE(4, 4);
        const value = Buffer.alloc(length);
        buf.copy(value, 0, 8, 8 + length);
        return [type, value.toString("utf8")];
    }
    static encode(type, value) {
        const valueBuf = Buffer.from(value);
        const buf = Buffer.alloc(8 + valueBuf.length);
        buf.writeIntBE(type, 0, 4);
        buf.writeIntBE(valueBuf.length, 4, 4);
        buf.write(value, 8, valueBuf.length);
        return buf.toString("base64");
    }
}
exports.Tlv = Tlv;
//# sourceMappingURL=index.js.map