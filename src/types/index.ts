export enum PunishmentType {
    BAN = 'ban',
    CHBAN = 'channel ban',
    MASSBAN = 'massban',
    SOFTBAN = 'softban',
    UNBAN = 'unban',
    UNCHBAN = 'un-channel ban',
    KICK = 'kick',
    MUTE = 'mute',
    VCMUTE = 'vc mute',
    UNMUTE = 'unmute',
    VCUNMUTE = 'vc unmute',
    WARN = 'warn',
}

export interface InfractionEntityOptions {
    victim: string;
    guild: string;
    expires?: number | Date;
    moderator: string;
    reason?: string;
    type: PunishmentType;
}
