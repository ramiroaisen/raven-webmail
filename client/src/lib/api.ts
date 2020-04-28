export type Mailbox = {
  id: string
  name: string
  path: string
  specialUse: string | null
  modifyIndex: number
  subscribed: boolean
  total: number
  unseen: number
}

export type Message = {
  id: number
  mailbox: string
  user: string
  thread: string
  envelope: {
    from : string,
    rcpt: {
      value: string
      formatted: string
    }
  }
  from: {
    name: string
    address: string
  }
  to: {
    name: string
    address: string
  }[]
  cc: {
    name: string
    address: string
  }[]
  bcc: {
    name: string
    address: string
  }[]
  subject: string
  messageId: string
  date: string
  list: {
    id: string
    unsubscribe: string
  }
  expires: string
  seen: boolean
  deleted: boolean
  flagged: boolean
  draft: boolean
  html: string[]
  text: string
  attachments?: {
    id: string
    filename: string
    contentType: string
    disposition: string
    transferEncoding: string
    related: boolean
    sizeKb: number
  }[],
  verificationResults?: {
    tls: {
      name: string
      version: string
    } | false
    spf: string | false
    dkim: string | false
  }
  contentType : {
    value: string
    params: Record<string, string>
  }
  metadata: any,
  reference: any
  files?: {
    id: string
    filename: string
    contentType: string
    size: number
  }[]
}

export type User = {
  id: string
  username: string
  name: string
  address: string
  retention: number | false
  enabled2fa: string[]
  autoreply: boolean
  encryptMessages: boolean
  encryptForwarded: boolean
  pubKey: string
  keyInfo: {
    name: string
    address: string
    fingerprint: string
  } | false
  metaData: any
  targets: string[]
  spamLevel: number
  limits: {
    quota: {
      allowed: number
      used: number
    }
    
    recipients: Quota
    forwards: Quota
    received: Quota
    imapUpload: Quota
    pop3Download: Quota
  }
  tags: string[]
  disabledScopes: string[]
  hasPasswordSet: boolean
  activated: boolean
  disabled: boolean
  suspended: boolean
}

export type Quota = {
  allowed: number
  used: number
  ttl: number
}