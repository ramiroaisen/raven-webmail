import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "E rometsoe",
      "drafts": "Litlhaku",
      "trash": "Litšila",
      "junk": "Spam"
    },
    "delete": "Tlosa foldara",
    "empty": "Lebokose lena la poso ha le na letho"
  },
  "message": {
    "labels": {
      "from": "E tsoa ho:",
      "to": "Ho:",
      "date": "E rometsoe:"
    }
  },
  "mailboxMessage": {
    "to": "Ho:"
  },
  "login": {
    "title": "kena",
    "action": "kena",
    "labels": {
      "username": "Username",
      "password": "Senotlolo"
    }
  },
  "accountButton": {
    "logout": "tsoaha",
    "myAccount": "Akhaonte Ea Hau",
    "filters": "Metlhotlo"
  },
  "compose": {
    "labels": {
      "to": "Ho:",
      "subject": "Sehlooho:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Molaetsa o mocha"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Pheta",
      "redo": "Redo",
      "fontName": "Mofuta oa mofuta",
      "fontSize": "Boholo ba fonte",
      "bold": "Sebete",
      "italic": "Mongolo o tšekaletseng",
      "underline": "Hatella",
      "justifyLeft": "Kopanya ka ho le letšehali",
      "justifyCenter": "Kopanya bohareng",
      "justifyRight": "Kopanya ka nepo",
      "insertUnorderedList": "Lenane",
      "insertOrderedList": "Lenane le ngotsoeng",
      "removeFormat": "Tlosa sebopeho"
    },
    "color": {
      "tooltip": "Mmala",
      "foreColor": "Mongolo",
      "backColor": "Semelo"
    },
    "upload": {
      "tooltip": "Qobella",
      "add": "Eketsa",
      "remove": "Tlosa"
    },
    "send": "Romella"
  },
  "selection": {
    "title": [
      "{n} melaetsa",
      "{n} molaetsa",
      "{n} melaetsa"
    ]
  },
  "actions": {
    "backToMailbox": "Khutlela lebokoseng la poso",
    "reload": "Ntlafatsa",
    "select": "Khetha",
    "markAsUnread": "Tšoaea eka ha e bale",
    "markAsRead": "Tšoaea joalo ka ha u baliloe",
    "moveTo": "Tsamaisetsa ho",
    "delete": "Tlosa",
    "deletePermanently": "Tlosa ka ho sa feleng",
    "discardDrafts": "Lahla ngollano",
    "markAsSpam": "Tšoaea joalo ka spam",
    "unMarkAsSpam": "Sena ha se spam",
    "forward": "E fetisetsa",
    "reply": "Karabo",
    "attachments": "Lits'oants'o"
  },
  "weekDays": {
    "0": "Sontaha",
    "1": "Mantaha",
    "2": "Labobeli",
    "3": "Laboraro",
    "4": "Labone",
    "5": "Labohlano",
    "6": "Moqebelo"
  },
  "months": {
    "0": "Pherekhong",
    "1": "Hlakola",
    "2": "Mots'eanong",
    "3": "Mmesa",
    "4": "Mots'eanong",
    "5": "Jun",
    "6": "Phupu",
    "7": "Phato",
    "8": "Loetse",
    "9": "Mphalane",
    "10": "Pulungoana",
    "11": "Mots'eanong"
  },
  "notifier": {
    "messageSent": "Ho romelletsoe molaetsa",
    "mailboxDeleted": "Folder e tlositsoe"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Foldara e ncha",
      "success": "Folder e thehiloe"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Theha foldara e ncha",
      "label": "Lebitso la lifoldara",
      "accept": "Bopa",
      "cancel": "Hlakola"
    },
    "deleteMailbox": {
      "title": "Tlosa foldara \"{mailbox}\"",
      "desc": "Tlhokomeliso. Ketso ena e tla hlakola melaetsa eohle e foldareng",
      "accept": "Tlosa",
      "cancel": "Hlakola"
    }
  },
  "myAccount": {
    "title": "Akhaonte Ea Hau",
    "commonActions": {
      "title": "Liketso tse tloaelehileng",
      "updatePassword": "Nchafatsa phasewete",
      "currentPassword": "Senotlolo sa Hajoale",
      "newPassword": "Phasewete e Ntjha",
      "confirmPassword": "Netefatsa phasewete e ncha"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "ho {gb} GB",
      "messagesUsed": [
        "{n} melaetsa",
        "{n} molaetsa",
        "{n} melaetsa"
      ],
      "messagesTotal": [
        "tsa melaetsa e {n}",
        "tsa {n} molaetsa",
        "tsa melaetsa e {n}"
      ],
      "storage": {
        "title": "Boloka"
      },
      "imapDownload": {
        "title": "Khoasolla IMAP",
        "comment": "letsatsi le letsatsi"
      },
      "imapUpload": {
        "title": "IMAP Tlanya",
        "comment": "letsatsi le letsatsi"
      },
      "pop3Download": {
        "title": "POP3 Khoasolla",
        "comment": "letsatsi le letsatsi"
      },
      "received": {
        "title": "E amohetse",
        "comment": "ka motsotso"
      },
      "recipients": {
        "title": "E rometsoe",
        "comment": "letsatsi le letsatsi"
      },
      "forwards": {
        "title": "E fetisetsoe",
        "comment": "letsatsi le letsatsi"
      }
    }
  },
  "filters": {
    "title": "Metlhotlo",
    "commingSoon": "E fihla haufinyane"
  }
};

export default locale;