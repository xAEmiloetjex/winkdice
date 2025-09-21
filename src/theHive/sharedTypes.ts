export interface IServerStats {
    status?: EServStat|"available"|"unavailable",
    players?: IPlayers[]|[],
    playercount: number,
    max_playercount: number,
    software: string,
    ip: string,
    port: number,
    version: string,
    ping: number,
    servername: string,
    hostname?: string,
    isBehindProxy:boolean
}

export interface IPlayers {
    name: string,
    vault: IVaultRank|IVaultRank[],
    gamemode: EGamemodes|"creative"|"survival"|"adventure"|"spectator",
}

export interface IVaultRank {
    prefix?: string,
    suffix?: string,
    rank_id: string
}

export enum EGamemodes {
    survival = "survival",
    creative = "creative",
    adventure = "adventure",
    spectator = "spectator"
}

export enum EServStat {
    available = "available",
    unavailable = "unavailable",
}