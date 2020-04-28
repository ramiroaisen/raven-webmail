export namespace Incomming {
  export interface Base {
    id: number
    type: string
  }

  export interface Login extends Base {
    type: "login"
    username: string
    password: string
  }

  export interface Ping extends Base {
    type: "ping"
  }

  export interface Pong extends Base {
    type: "pong"
    replyTo: number
  }

  export interface Get extends Base {
    type: "get"
    path: string
  }

  export interface Post extends Base {
    type: "post"
    path: string
    body: Record<string, any>
  }

  export interface Put extends Base {
    type: "put"
    path: string
    body: Record<string, any>
  }

  export interface Del extends Base {
    type: "del"
    path: string
  }

  export interface Watch extends Base {
    type: "watch"
    callbackId: number
  }

  export type Message = Login | Get | Post | Put | Del | Ping | Pong | Watch;
}

export namespace Outgoing {
  export interface Base {
    id: number
    type: string
  }

  export interface Ping extends Base {
    type: "ping"
  }

  export interface Pong extends Base {
    type: "pong"
    replyTo: number
  }

  export interface Resolve extends Base {
    type: "resolve",
    replyTo: number,
    arg: any
  }

  export interface Reject extends Base {
    type: "reject"
    replyTo: number
    message: string
  }

  export interface Call extends Base {
    type: "call"
    callId: number
    arg: any
  }

  export interface Error extends Base {
    type: "error"
    message: string
  }

  export type Message = Resolve | Reject | Call | Error | Ping | Pong;
}
