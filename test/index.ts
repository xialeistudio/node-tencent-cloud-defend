import * as should from "should";
import { TencentCloudDefend, Tlv } from "../index";

describe("test tlv", () => {
  it("encode '1'", async () => {
    should(Tlv.encode(1, "1")).equal("AAAAAQAAAAEx");
  });
  it("encode '天气不错'", async () => {
    should(Tlv.encode(1, "天气不错")).equal("AAAAAQAAAAzlpKnmsJTkuI3plJk=");
  });
  it("decode '1'", async () => {
    const ret = Tlv.decode("AAAAAQAAAAEx");
    should(ret[0]).equal(1);
    should(ret[1]).equal("1");
  });
  it("decode '天气不错'", async () => {
    const ret = Tlv.decode("AAAAAQAAAAzlpKnmsJTkuI3plJk=");
    should(ret[0]).equal(1);
    should(ret[1]).equal("天气不错");
  });
});
describe("test tencentDefent", () => {
  it("test UgcAntiSpam", async () => {
    if (!process.env.SECRETID || !process.env.SECRETKEY) {
      throw new Error("请配置secretId和secretKey");
    }
    const tencentDefend = new TencentCloudDefend(process.env.SECRETID, process.env.SECRETKEY);
    const args = {
      accountType: 0,
      messageId: Date.now(),
      messageStruct: Tlv.encode(1, "bao夜①ooo_聅糸電诂【１3１&****&****】"),
      postIp: "127.0.0.1",
      uid: 1,
    };
    const data = await tencentDefend.request("GET", "UgcAntiSpam", args);
    should(data).hasOwnProperty("code", "响应码");
    should(data).hasOwnProperty("level", "恶意等级");
    should(data).hasOwnProperty("type", "系统命中关键词类别");
  });
});
