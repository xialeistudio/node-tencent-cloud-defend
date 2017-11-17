import * as crypto from "crypto";
import fetch from "node-fetch";

export class TencentCloudDefend {
  private secretId: string;
  private secretKey: string;
  private regionId: string;
  private url: string;

  constructor(secretId: string, secretKey: string, regionId = "gz", url = "csec.api.qcloud.com/v2/index.php") {
    this.secretId = secretId;
    this.secretKey = secretKey;
    this.regionId = regionId;
    this.url = url;
  }

  public async request(method: string, action: string, args: any, timeout = 2000): Promise<any> {
    const url = this.makeUrl(method, action, args);
    const res = await fetch(url, { timeout });
    return res.json();
  }

  public makeUrl(method: string, action: string, args: any): string {
    args.Nonce = Math.floor(Math.random() * 1000000);
    args.Action = action;
    args.Region = this.regionId;
    args.SecretId = this.secretId;
    args.Timestamp = parseInt((Date.now() / 1000).toString(), 10);
    args.Signature = this.makeSign(method, args);
    return `https://${this.url}?${this.makeQueryString(args, true)}`;
  }

  private makeSign(method: string, args: any): string {
    return this.hmacSha1(`${method}${this.url}?${this.makeQueryString(args, false)}`);
  }

  private makeQueryString(args: any, encoded: boolean): string {
    const keys = Object.keys(args).sort();
    const params: any[] = [];
    keys.forEach((key) => {
      if (encoded) {
        params.push(`${key}=${encodeURIComponent(args[key])}`);
      } else {
        params.push(`${key}=${args[key]}`);
      }
    });
    return params.join("&");
  }

  private hmacSha1(data: Buffer | string): string {
    const hash = crypto.createHmac("sha1", this.secretKey);
    hash.update(data);
    return hash.digest("base64");
  }
}

export class Tlv {
  public static decode(str: string): any[] {
    const buf = new Buffer(str, "base64");
    const type = buf.readIntBE(0, 4);
    const length = buf.readIntBE(4, 4);
    const value = Buffer.alloc(length);
    buf.copy(value, 0, 8, 8 + length);
    return [type, value.toString("utf8")];
  }

  public static encode(type: any, value: any): string {
    const valueBuf = Buffer.from(value);
    const buf = Buffer.alloc(8 + valueBuf.length);
    buf.writeIntBE(type, 0, 4);
    buf.writeIntBE(valueBuf.length, 4, 4);
    buf.write(value, 8, valueBuf.length);
    return buf.toString("base64");
  }
}
