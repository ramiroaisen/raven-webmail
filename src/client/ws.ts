import Ws from "ws";
import { IncomingMessage, Server } from "http";
import { Socket } from "net";
import { Client } from "./client";
import { assertType } from "typescript-is";
import { Incomming, Outgoing } from "./io";
import { session } from "../session";
import { Request, Response } from "express";
import { Config } from "../config";

let _uid = 0;
const uid = () => ++_uid;

export const ws = (srv: Server, config: Config, session: any) => {

  srv.on("upgrade", (req: IncomingMessage, socket: Socket, head: any) => {
    session(req as Request, {} as Response, () => {
      server.handleUpgrade(req, socket, head, (ws) => {
        server.emit("connection", ws, req, (req as Request).session!);
      })
    })
  })

  const server = new Ws.Server({ noServer: true });

  server.on("connection", (ws: Ws, req: IncomingMessage, session: Express.Session) => {
    
    const client = new Client({host: config.wildduck_api_url, accessToken: session.accessToken});

    const send = (msg: Outgoing.Message) => {
      ws.send(JSON.stringify(msg));
    }

    if ( session.accessToken ) {
      client.get("/users/me").then(user => {
        ws.send(JSON.stringify({user}));
      }).catch(e => {
        ws.send(JSON.stringify({user: null}));
      })
    } else {
      ws.send(JSON.stringify({user: null}));
    }

    ws.on("message", async (m) => {
      try {

        const json = JSON.parse(m.toString());

        const msg = assertType<Incomming.Message>(json);

        try {
          switch (msg.type) {
            case "login":
              const token = await client.login(msg.username, msg.password);
              const user = await client.get("/users/me");
              session.accessToken = token;
              send({
                id: uid(),
                replyTo: msg.id,
                type: "resolve",
                arg: user
              })
              break;

            case "get":
              send({
                id: uid(),
                replyTo: msg.id,
                type: "resolve",
                arg: await client.get(msg.path)
              })
              break;

            case "post":
              send({
                id: uid(),
                replyTo: msg.id,
                type: "resolve",
                arg: await client.post(msg.path, msg.body)
              })
              break;

            case "put":
              send({
                id: uid(),
                replyTo: msg.id,
                type: "resolve",
                arg: await client.put(msg.path, msg.body)
              })
              break;

            case "del":
              send({
                id: uid(),
                replyTo: msg.id,
                type: "resolve",
                arg: await client.del(msg.path)
              })
              break;

            case "ping":
              send({
                id: uid(),
                replyTo: msg.id,
                type: "pong"
              })
              break;

            case "watch":
              const unwatch = client.watch(data => {
                send({id: uid(), type: "call", callId: msg.callbackId, arg: data })
              })
              // send watcher id here
              send({id: uid(), type: "resolve", replyTo: msg.id, arg: {}});
              ws.on("close", unwatch);
              break;

          }
        } catch (e) {
          send({ id: uid(), replyTo: msg.id, type: "reject", message: e.message })
          return;
        }

      } catch (e) {
        send({ id: uid(), type: "error", message: e.message })
        return;
      }
    })
  })
}