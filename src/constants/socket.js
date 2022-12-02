export const WS_URL = process.env.VUE_APP_WS_URL;
export const WS_CONFIG = {
  debug: true,
  connection: WS_URL,
  options: {
    withCredentials: true,
  },
};
