import { useEffect, useState } from "react";
import UnityComponent from "./UnityComponent";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  let auth;
  
  const VITE_DISCORD_CLIENT_ID = "1228627729700753498";
  console.log(VITE_DISCORD_CLIENT_ID);
  //const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
  const discordSdk = new DiscordSDK(VITE_DISCORD_CLIENT_ID);

  const [userName, setUserName] = useState("_");
  //const API_ENDPOINT = 'https://discord-unity-app.fly.dev';

  useEffect(() => {
    setupDiscordSdk();
  }, [userName]);

  async function setupDiscordSdk() {
    await discordSdk.ready();

    // Discordクライアントの認証
    const { code } = await discordSdk.commands.authorize({
      //client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      client_id: VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: ["identify"],
    });

    // サーバーからaccess_tokenを取得
    const response = await fetch("/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });
    const { access_token } = await response.json();

    // access_tokenを用いた認証
    auth = await discordSdk.commands.authenticate({
      access_token,
    });

    if (auth == null) {
      console.log("Authenticate command failed");
      throw new Error("Authenticate command failed");
    }

    // ユーザー情報の取得
    const user: { username: string } = await fetch(
      `https://discord.com/api/users/@me`,
      {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((reply) => reply.json());

    // ユーザー名の設定
    setUserName(user.username);
    
  }
  
  console.log("setUserName: " + userName);
  setUserName(userName);
  return <UnityComponent userName={userName} />;
  
}

export default App;