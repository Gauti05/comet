import React, { useEffect, useState } from "react";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";  // v6
import { CometChat } from "@cometchat/chat-sdk-javascript";


const APP_ID = "1672117e6e1b61cb2"
const REGION = "in";
const AUTH_KEY = "4b5f7e3ea8aeef767682fe9cdbbcfb8d77021fa0";
const UID = 	"intern_user_1";

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const appSettings = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(REGION)
      .build();

    CometChat.init(APP_ID, appSettings)
      .then(() => {
        if (cancelled) return;

        CometChat.getLoggedinUser()
          .then((user) => {
            if (user) {
              setIsReady(true);
            } else {
              CometChat.login(UID, AUTH_KEY)
                .then(() => !cancelled && setIsReady(true))
                .catch((e) => !cancelled && setError(e.message));
            }
          })
          .catch((e) => !cancelled && setError(e.message));
      })
      .catch((e) => !cancelled && setError(e.message));

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>CometChat Error</h2>
        <pre>{error}</pre>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Initializing CometChat…</h2>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <CometChatUIKit />
    </div>
  );
}

export default App;