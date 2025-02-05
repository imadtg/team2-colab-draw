import type * as Party from "partykit/server";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
`Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(`{"type": "server", "data": "hello from server"}`);
  }

  onClose(conn: Party.Connection) {
    console.log(
`Disconnected:
  id: ${conn.id}
  room: ${this.room.id}`
    );
    this.room.broadcast(`{"type": "connection", "id": "${conn.id}", "room": "${this.room.id}"}`);
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `{"type": "message", "sender": "${sender.id}", "data": ${message}}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
