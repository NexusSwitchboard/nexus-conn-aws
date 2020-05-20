import AWS from "aws-sdk";
import {Connection, ConnectionConfig, GlobalConfig} from "@nexus-switchboard/nexus-extend";

export interface IAwsConfig extends ConnectionConfig {
    keyId: string;
    secretKey: string;
    region: string;
}

export class AwsConnection extends Connection {

    public name = "Aws";
    public _s3: AWS.S3;
    public _comprehend: AWS.Comprehend;

    public get s3Api() {
        if (!this._s3) {
            this._s3 = new AWS.S3(this.getServiceOptions())
        }

        return this._s3;
    }

    public get comprehendApi() {
        if (!this._comprehend) {
            this._comprehend = new AWS.Comprehend(this.getServiceOptions())
        }

        return this._s3;
    }

    protected getServiceOptions() {
        return {
            credentials: {
                accessKeyId: this.config.keyId,
                secretAccessKey: this.config.secretKey
            },
            region: this.config.region
        }
    }

    /**
     * This connect will attempt to pull the account information via API request which
     * means that the account name associated with this instance may not be available
     * immediately.
     */
    public connect(): AwsConnection {
        // unlike other connections, APIs are initialized only when they are needed.  This is
        //  because there are a lot of separate services that can be initialized so rather than
        //  creating all of them we just wait until they are needed.  For example, if you want
        //  to use the s3 API, you would access the s3Api property which would create the client
        //  the first time it's accessed.

        return this;
    }

    public disconnect(): boolean {
        if (this._s3) {
            delete this._s3;
        }

        if (this._comprehend) {
            delete this._comprehend;
        }

        return true;
    }
}

export default function createConnection(cfg: ConnectionConfig, globalCfg: GlobalConfig): Connection {
    return new AwsConnection(cfg, globalCfg);
}
