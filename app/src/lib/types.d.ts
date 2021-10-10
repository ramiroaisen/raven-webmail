export type User = {
  id: string
  username: string
  name: string | null,
  address: string | null,
  retention: number
  enabled2fa: string[]
  autoreply: boolean
  encryptMessages: boolean
  encryptForwarded: boolean
  pubKey: string
  keyInfo: {
    name: string
    address: string
    fingerprint: string
  } | false,
  metaData: any
  internalData: any
  targets: string[]
  spamLevel: number
  limits: {
    quota: {
      allowed: number
      used: number
    }
    recipients: {
      allowed: number
      used: number
      ttl: number
    }
    forwards: {
      allowed: number
      used: number
      ttl: number
    }
    received: {
      allowed: number
      used: number
      ttl: number
    },
    imapUpload: {
      allowed: number
      used: number
      ttl: number
    }
    imapDownload: {
      allowed: number
      used: number
      ttl: number
    }
    pop3Download: {
      allowed: number
      used: number
      ttl: number
    }
    imapMaxConnections: {
      allowed: number
      used: number
    }
  }
  fromWhitelist: string[]	
  disabledScopes: string[]
  hasPasswordSet: boolean
  activated: boolean
  disabled: boolean
  suspended: boolean
}

export type Mailbox = {
  id: string
  name: string
  path: string
  specialUse: string | null
  modifyIndex: number
  subscribed: boolean
  hidden: boolean
  total: number
  unseen: number
}

export type Messages = {
  success: true,
  total: number
  page: number
  previousCursor: false | string
  nextCursor: false | string
  specialUse: string | null
  results: Message[] 
}

export type Address = {
  address: string
  name: string | null
}

export type Message = {
  id: number
  mailbox: string
  thread?: string
  threadMessageCount?: number
  from?: Address
  to?: Address[]
  cc?: Address[]
  bcc?: Address[]
  subject: string
  messageId: string
  date: string
  idate: string | null
  intro: string
  attachments: boolean
  seen: boolean
  deleted: boolean
  flagged: boolean
  forwarded: boolean
  contentType: {
    value: string
    params: Record<string, string>
  }
  metadata?: any  

  html: string[]
  text: string
}

export type FullMessage = {
  id: number
  mailbox: string
  user: string
  thread: string
  from?: Address
  to?: Address[]
  cc?: Address[]
  bcc?: Address[]
  subject: string
  messageId: string
  date: string
  idate: string | null
  list?: {
    id: string
    unsubcribe: string
  }
  expires: string
  seen: boolean
  deleted: boolean
  flagged: boolean
  forwarded: boolean
  contentType: {
    value: string
    params: Record<string, string>
  }
  html: string[]
  text: string
  attachments?: Attchment[]
  verificationResults?: {
    tls: {
      name: any
      version: any
    }
    spf: any
    dkim: any
  }
  metadata: any  
  reference?: any
  files?: any
  outbound?: any 
}

export type Attachment = {
  id: string
  hash?: string
  filename: string
  contentType: string
  disposition: string
  transferEncoding: string
  related: boolean
  sizeKb: number
}

declare module "html-escape" {
	const s: (src: string) => string;
	export default s; 
}