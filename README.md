# 腾讯云天御业务安全防护NodeJS SDK
提供NodeJs快速接入方案。[腾讯云相关文档](https://cloud.tencent.com/document/product/295/2910)

## 安装
```bash
npm install tencent-cloud-defend --save
```
## 功能
[x] 通用请求接口
[x] TLV编解码(暂不支持嵌套)

## 单元测试
1. 设置 SECRETID、SECRETKEY 环境变量
2. npm test

## 例子（消息过滤）
1. 实例化请求客户端

```javascript
 import {Tlv, TencentCloudDefend} from "tencent-cloud-defend";
 const tencentDefend = new TencentCloudDefend(process.env.SECRETID, process.env.SECRETKEY);
```
2. 构造请求参数

```javascript
const args = {
      accountType: 0,
      messageId: Date.now(),
      messageStruct: Tlv.encode(1, "bao夜①ooo_聅糸電诂【１3１&****&****】"),
      postIp: "127.0.0.1",
      uid: 1,
};
```

3. 发出请求

```javascript
const data = await tencentDefend.request("GET", "UgcAntiSpam", args);
console.log(data);
```

4. 响应参数

```json
{
    "Nonce": 952007,
    "beatTips": "",
    "code": 0,
    "codeDesc": "Success",
    "level": 0,
    "message": "No Error",
    "messageId": "1510891343223",
    "postIp": "127.0.0.1",
    "selfType": 0,
    "type": 0,
    "uid": "1"
}
```