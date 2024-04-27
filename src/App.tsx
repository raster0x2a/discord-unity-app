import { useEffect, useState } from "react";
//import { useState } from "react";
import UnityComponent from "./UnityComponent";
import { DiscordSDK } from "@discord/embedded-app-sdk";

function App() {
  let auth;
  
  const VITE_DISCORD_CLIENT_ID = "1228627729700753498";
  console.log(VITE_DISCORD_CLIENT_ID);
  //const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);
  const discordSdk = new DiscordSDK(VITE_DISCORD_CLIENT_ID);

  //const [userName] = useState("_");
  const [userName, setUserName] = useState("_");
  let tmpUserName = "__";
  //const API_ENDPOINT = 'https://discord-unity-app.fly.dev';


  //const [update, setUpdate] = useState<boolean>(false);
  
  
  //setupDiscordSdk();
  
  /*
  useEffect(() => {
    //setupDiscordSdk();
    console.log("setUserName 3: " + userName);
    setupDiscordSdk()
      .then((newUserName) => {
        console.log("setUserName 5: " + userName);
        setUserName(newUserName + "!");
      });
    console.log("setUserName 4: " + userName);
    setUserName(userName + "!");
    setUpdate(update ? false : true);
    //setUserName(tmpUserName);
    //setUserName(userName => { return userName + "!" });
  }, []);
  */

  useEffect(() => {
    setupDiscordSdk().then(() => {
      setUserName(tmpUserName + "!");
    });

  }, []);

  useEffect(() => {
    console.log("setUserName 6: " + userName);
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
    tmpUserName = user.username
    //setUserName((tmpUserName) => { return tmpUserName + "!"});
    console.log("setUserName 1: " + userName);

    return user.username;
  }
  
  
  console.log("setUserName 2: " + userName);
  //setUpdate(update ? false : true);
  return <UnityComponent userName={userName} />;
  
}

export default App;