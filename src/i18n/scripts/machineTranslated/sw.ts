import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Kikasha",
      "sent": "Imetumwa",
      "drafts": "Rasimu",
      "trash": "Takataka",
      "junk": "Spam"
    },
    "empty": "Sanduku la barua ni tupu"
  },
  "message": {
    "labels": {
      "from": "Kutoka:",
      "to": "Kwa:",
      "date": "Iliyotumwa:"
    }
  },
  "mailboxMessage": {
    "to": "Kwa:"
  },
  "login": {
    "title": "Weka sahihi",
    "action": "Weka sahihi",
    "labels": {
      "username": "Jina la mtumiaji",
      "password": "Nywila"
    }
  },
  "accountButton": {
    "logout": "Toka",
    "myAccount": "Akaunti yangu"
  },
  "compose": {
    "labels": {
      "to": "Kwa:",
      "subject": "Mada:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Ujumbe mpya"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Tendua",
      "redo": "Rudia",
      "fontName": "Aina ya herufi",
      "fontSize": "Saizi ya herufi",
      "bold": "Jasiri",
      "italic": "Italia",
      "underline": "Sisitiza",
      "justifyLeft": "Panga kushoto",
      "justifyCenter": "Panga katikati",
      "justifyRight": "Panga sawa",
      "insertUnorderedList": "Orodha",
      "insertOrderedList": "Orodha ya nambari",
      "removeFormat": "Ondoa muundo"
    },
    "color": {
      "tooltip": "Rangi",
      "foreColor": "Maandishi",
      "backColor": "Asili"
    },
    "upload": {
      "tooltip": "Ambatisha",
      "add": "Ongeza",
      "remove": "Ondoa"
    },
    "send": "Tuma"
  },
  "selection": {
    "title": [
      "Ujumbe wa {n}",
      "Ujumbe wa {n}",
      "Ujumbe wa {n}"
    ]
  },
  "actions": {
    "backToMailbox": "Rudi kwa sanduku la barua",
    "reload": "Sasisha",
    "select": "Chagua",
    "markAsUnread": "Weka alama kama haujasomwa",
    "markAsRead": "Weka alama kama unavyosoma",
    "moveTo": "Sogeza kwa",
    "delete": "Futa",
    "deletePermanently": "Futa kabisa",
    "discardDrafts": "Tupa rasimu",
    "markAsSpam": "Weka alama kama taka",
    "unMarkAsSpam": "Hii sio spam",
    "forward": "Mbele",
    "reply": "Jibu",
    "attachments": "Viambatisho"
  },
  "weekDays": {
    "0": "Jumapili",
    "1": "Jumatatu",
    "2": "Jumanne",
    "3": "Jumatano",
    "4": "Alhamisi",
    "5": "Ijumaa",
    "6": "Jumamosi"
  },
  "months": {
    "0": "Januari",
    "1": "Februari",
    "2": "Machi",
    "3": "Aprili",
    "4": "Mei",
    "5": "Jun",
    "6": "Julai",
    "7": "Agosti",
    "8": "Septemba",
    "9": "Oktoba",
    "10": "Novemba",
    "11": "Desemba"
  },
  "notifier": {
    "messageSent": "Ujumbe umetumwa"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Folder mpya",
      "success": "Folda imeundwa"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Unda folda mpya",
      "label": "Jina la folda",
      "accept": "Unda",
      "cancel": "Ghairi"
    }
  },
  "myAccount": {
    "title": "Akaunti yangu",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "ya {gb} GB",
      "messagesUsed": [
        "Ujumbe wa {n}",
        "Ujumbe wa {n}",
        "Ujumbe wa {n}"
      ],
      "messagesTotal": [
        "ya {n} ujumbe",
        "ya {n} ujumbe",
        "ya {n} ujumbe"
      ],
      "storage": {
        "title": "Hifadhi"
      },
      "imapDownload": {
        "title": "Pakua IMAP",
        "comment": "kila siku"
      },
      "imapUpload": {
        "title": "Upakiaji wa IMAP",
        "comment": "kila siku"
      },
      "pop3Download": {
        "title": "POP3 Pakua",
        "comment": "kila siku"
      },
      "received": {
        "title": "Imepokelewa",
        "comment": "kwa dakika"
      },
      "recipients": {
        "title": "Imetumwa",
        "comment": "kila siku"
      },
      "forwards": {
        "title": "Imeelekezwa",
        "comment": "kila siku"
      }
    }
  }
};

export default locale;