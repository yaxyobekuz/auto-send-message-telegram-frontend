import { useEffect } from "react";

export default () => {
  const tg = window.Telegram.WebApp;

  useEffect(() => tg.ready(), []);

  const onClose = () => tg.close();

  const openTelegramLink = (url) => {
    tg.openTelegramLink(`https://t.me/${url}`);
  };

  const setHeaderColor = (color) => {
    tg?.setHeaderColor(color);
  };

  const user = tg.initDataUnsafe?.user;

  return { onClose, user, tg, openTelegramLink, setHeaderColor };
};
