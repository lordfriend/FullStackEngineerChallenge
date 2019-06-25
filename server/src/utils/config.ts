export class ConfigManager {

    public static instance: ConfigManager;

    public static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private _dbHost: string;
    private _dbPort: number;
    private _dbUser: string;
    private _dbName: string;
    private _dbPass: string;

    public get dbHost(): string {
        return this._dbHost;
    }

    public get dbPort(): number {
        return this._dbPort;
    }

    public get dbUser(): string {
        return this._dbUser;
    }

    public get dbName(): string {
        return this._dbName;
    }

    public get dbPass(): string {
        return this._dbPass;
    }

    public load() {
        this._dbHost = process.env.DB_HOST || 'localhost';
        this._dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
        this._dbUser = process.env.DB_USER || 'postgres';
        this._dbName = process.env.DB_NAME || 'paypay_challenge';
        this._dbPass = process.env.DB_PASS || '123456';
    }
}
