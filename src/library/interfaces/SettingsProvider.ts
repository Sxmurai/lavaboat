export interface guildSettings {
  config: {
    prefix: string;
    djRole: string | null;
  };
}

export const defaultGuildSettings = {
  config: {
    prefix: "l!",
    djRole: null,
  },
};
