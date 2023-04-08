import { Stomp } from '@stomp/stompjs';

class EditorSocket {
  public client = Stomp.client("ws://localhost:8080/websocket");

  constructor() {
    this._init()
  }

  private _init() {
    const headers = {
      login: 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzc3MiLCJleHAiOjE2NzYzODQ3NTR9.h_vJ16P83GiIwKnFz7Bn2YAedHMGPbmVSWptExw4OagtZCKUmNlRhX3BXUtusEPo',
      // passcode: 'mypasscode',
      // additional header
      // 'client-id': 'my-client-id'
    };

    this.client.connect(headers, () => {
      this.client.subscribe("/topic/messages", message => console.log(message));

    });

    this.client.activate();

    this.client.subscribe("/topic/messages", message => {
      console.log(message)
    })

  }

  public sendMessage() {
    this.client.send("/app/messages", {
      login: 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzc3MiLCJleHAiOjE2NzYzODQ3NTR9.h_vJ16P83GiIwKnFz7Bn2YAedHMGPbmVSWptExw4OagtZCKUmNlRhX3BXUtusEPo',
      // passcode: 'mypasscode',
      // additional header
      // 'client-id': 'my-client-id'
    }, JSON.stringify({ from: "ee", text: "Hello, STOMP" }));
  }

}

export default EditorSocket;