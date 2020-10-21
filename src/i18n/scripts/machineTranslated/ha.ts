import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Akwati",
      "sent": "An aika",
      "drafts": "Zane-zane",
      "trash": "Shara",
      "junk": "Wasikun Banza"
    },
    "delete": "Share babban fayil",
    "empty": "Wannan akwatin gidan waya fanko ne"
  },
  "message": {
    "labels": {
      "from": "Daga:",
      "to": "Zuwa ga:",
      "date": "A aika:"
    }
  },
  "mailboxMessage": {
    "to": "Zuwa ga:"
  },
  "login": {
    "title": "Shiga ciki",
    "action": "Shiga ciki",
    "labels": {
      "username": "Sunan mai amfani",
      "password": "Kalmar sirri"
    }
  },
  "accountButton": {
    "logout": "Fita fita",
    "myAccount": "Asusun",
    "filters": "Tace"
  },
  "compose": {
    "labels": {
      "to": "Zuwa ga:",
      "subject": "Take:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Sabon sako"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Komawa",
      "redo": "Redo",
      "fontName": "Nau'in rubutu",
      "fontSize": "Girman tanada",
      "bold": "Bold",
      "italic": "Italic",
      "underline": "Ja layi a layi",
      "justifyLeft": "A daidaita hagu",
      "justifyCenter": "A daidaita tsakiya",
      "justifyRight": "A mayar da hannun dama",
      "insertUnorderedList": "Lissafi",
      "insertOrderedList": "Jerin lambobi",
      "removeFormat": "Cire tsari"
    },
    "color": {
      "tooltip": "Launi",
      "foreColor": "Rubutu",
      "backColor": "Bayan Fage"
    },
    "upload": {
      "tooltip": "Haɗawa",
      "add": ".Ara",
      "remove": "Cire"
    },
    "send": "Aika"
  },
  "selection": {
    "title": [
      "{n} sakonni",
      "{n} sakon",
      "{n} sakonni"
    ]
  },
  "actions": {
    "backToMailbox": "Komawa zuwa akwatin gidan waya",
    "reload": "Sanya",
    "select": "Zaɓi",
    "markAsUnread": "Yi alama kamar ba a karanta ba",
    "markAsRead": "Yi alama yayin karantawa",
    "moveTo": "Matsa zuwa",
    "delete": "Share",
    "deletePermanently": "Share har abada",
    "discardDrafts": "A watsar da zane-zanen",
    "markAsSpam": "Yi alama azaman spam",
    "unMarkAsSpam": "Wannan ba wasikun banza bane",
    "forward": "Gaba",
    "reply": "Amsa",
    "attachments": "Haɗe-haɗe"
  },
  "weekDays": {
    "0": "Lahadi",
    "1": "Litinin",
    "2": "Talata",
    "3": "Laraba",
    "4": "Alhamis",
    "5": "Juma'a",
    "6": "Asabar"
  },
  "months": {
    "0": "Janairu",
    "1": "Fabrairu",
    "2": "Maris",
    "3": "Afrilu",
    "4": "Mayu",
    "5": "Yuni",
    "6": "Yuli",
    "7": "Agusta",
    "8": "Satumba",
    "9": "Oktoba",
    "10": "Nuwamba",
    "11": "Disamba"
  },
  "notifier": {
    "messageSent": "An aika da sako",
    "mailboxDeleted": "An cire babban fayil"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Sabon babban fayil",
      "success": "Jaka an kirkiro"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Newirƙiri sabon babban fayil",
      "label": "Sunan babban fayil",
      "accept": ".Irƙira",
      "cancel": "Soke"
    },
    "deleteMailbox": {
      "title": "Share babban fayil \"{mailbox}\"",
      "desc": "Tsanani. Wannan aikin zai share har abada duk saƙonni a cikin fayil",
      "accept": "Share",
      "cancel": "Soke"
    }
  },
  "myAccount": {
    "title": "Asusun",
    "commonActions": {
      "title": "Ayyuka gama gari",
      "updatePassword": "Sabunta kalmar wucewa",
      "currentPassword": "Kalmar shiga na halin yanzu",
      "newPassword": "Sabuwar kalmar shiga",
      "confirmPassword": "Tabbatar da sabuwar kalmar shiga"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "na {gb} GB",
      "messagesUsed": [
        "{n} sakonni",
        "{n} sakon",
        "{n} sakonni"
      ],
      "messagesTotal": [
        "daga sakonnin {n}",
        "daga sakon {n}",
        "daga sakonnin {n}"
      ],
      "storage": {
        "title": "Adanawa"
      },
      "imapDownload": {
        "title": "Sauke IMAP",
        "comment": "kullun"
      },
      "imapUpload": {
        "title": "Hoto IMAP",
        "comment": "kullun"
      },
      "pop3Download": {
        "title": "POP3 Saukewa",
        "comment": "kullun"
      },
      "received": {
        "title": "Aka karba",
        "comment": "by minti"
      },
      "recipients": {
        "title": "An aika",
        "comment": "kullun"
      },
      "forwards": {
        "title": "An sake juyawa",
        "comment": "kullun"
      }
    }
  },
  "filters": {
    "title": "Tace",
    "commingSoon": "Bada jimawa ba"
  }
};

export default locale;