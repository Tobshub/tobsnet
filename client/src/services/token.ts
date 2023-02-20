const TOKEN = "tobsnet_client_token___";

const token = {
  set(val: string) {
    localStorage.setItem(TOKEN, JSON.stringify(val));
  },
  get() {
    const raw = localStorage.getItem(TOKEN);
    const token = raw ? JSON.parse(raw) : undefined;
    return token as string | undefined;
  },
  remove() {
    localStorage.removeItem(TOKEN);
  },
};

export default token;
