import { jwtDecode } from "jwt-decode";

export const setupAutoLogout = (token, onExpire) => {
  try {
    const { exp } = jwtDecode(token); // exp is in seconds
    const currentTime = Date.now() / 1000;
    const timeout = (exp - currentTime) * 1000;

    if (timeout <= 0) {
      onExpire(); // already expired
    } else {
      return setTimeout(onExpire, timeout);
    }
  } catch (err) {
    console.error("Failed to decode token:", err);
    onExpire();
  }
};
