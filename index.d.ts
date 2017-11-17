export declare class TencentCloudDefend {
    private secretId;
    private secretKey;
    private regionId;
    private url;
    constructor(secretId: string, secretKey: string, regionId?: string, url?: string);
    request(method: string, action: string, args: any, timeout?: number): Promise<any>;
    makeUrl(method: string, action: string, args: any): string;
    private makeSign(method, args);
    private makeQueryString(args, encoded);
    private hmacSha1(data);
}
export declare class Tlv {
    static decode(str: string): any[];
    static encode(type: any, value: any): string;
}
