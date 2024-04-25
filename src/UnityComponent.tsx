import { useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

interface UnityCompoonentProps {
  userName: string;
}

const UnityComponent = (props: UnityCompoonentProps) => {
  // UnityContextを準備、表示するUniyアプリを指定
  const { unityProvider, sendMessage, isLoaded } = useUnityContext({
    loaderUrl: "Build/DiscordApp.loader.js",
    dataUrl: "Build/DiscordApp.data",
    frameworkUrl: "Build/DiscordApp.framework.js",
    codeUrl: "Build/DiscordApp.wasm",
  });

  // useEffectの対象にisLoadedを含めない場合
  // 環境によってはsendMessageが動作しない問題がある
  useEffect(() => {
    if (isLoaded) {
      // Unityアプリに対してメッセージを送信
      // sendMessage("オブジェクト名", "関数名", 引数)
      sendMessage("Canvas", "SetText", props.userName);
    }
  }, [isLoaded]);

  return <Unity id="unity-canvas" unityProvider={unityProvider} />;
};

export default UnityComponent;