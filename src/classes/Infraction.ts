import { DiscordSnowflake as Snowflake } from '@sapphire/snowflake';
import { InfractionEntityOptions, PunishmentType } from '../types';

export class Infraction {
    public id!: string;
    public issued!: Date;
    public expires!: Date;
    public guild!: string;
    public victim!: string;
    public moderator!: string;
    public reason!: string;
    public type!: PunishmentType;

    constructor(options: InfractionEntityOptions) {
        if (!options?.guild) return;

        const timestamp = new Date();

        this.id = Snowflake.generate({ timestamp }).toString();
        this.issued = timestamp;
        this.expires = (typeof options.expires === 'number' ? new Date(options.expires) : options.expires) || null!;
        this.guild = options.guild;
        this.victim = options.victim;
        this.moderator = options.moderator;
        this.reason = options.reason || 'No reason provided.';
        this.type = options.type;
    }
}
