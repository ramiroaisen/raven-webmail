import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "Diray",
      "drafts": "Qoraallada",
      "trash": "Qashinka",
      "junk": "Khayaamo"
    },
    "delete": "Tirtir faylka",
    "empty": "Sanduuqa boosta waa faaruq"
  },
  "message": {
    "labels": {
      "from": "Ka:",
      "to": "Ku:",
      "date": "Diray:"
    }
  },
  "mailboxMessage": {
    "to": "Ku:"
  },
  "login": {
    "title": "Gal",
    "action": "Gal",
    "labels": {
      "username": "Adeegsade",
      "password": "Furaha"
    }
  },
  "accountButton": {
    "logout": "Ka bax",
    "myAccount": "Xisaabteyda"
  },
  "compose": {
    "labels": {
      "to": "Ku:",
      "subject": "Mawduuca:",
      "cc": "Og:",
      "bcc": "Bcc"
    },
    "tabs": {
      "newMessageTitle": "Farriin cusub"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Ka gaabso",
      "redo": "Redo",
      "fontName": "Nooca Font",
      "fontSize": "Cabbirka foornada",
      "bold": "Caano",
      "italic": "Waa farqi",
      "underline": "Hoosta ka xariiq",
      "justifyLeft": "Bidix bidix",
      "justifyCenter": "Dhex dhexaad",
      "justifyRight": "Ku toosi midig",
      "insertUnorderedList": "Liiska",
      "insertOrderedList": "Liiska nambarada",
      "removeFormat": "Ka saar qaabka"
    },
    "color": {
      "tooltip": "Midab",
      "foreColor": "Qoraal",
      "backColor": "Asalka"
    },
    "upload": {
      "tooltip": "Ku lifaaq",
      "add": "Kudar",
      "remove": "Ka saar"
    },
    "send": "Dir"
  },
  "selection": {
    "title": [
      "{n} farriimaha",
      "{n} farriin",
      "{n} farriimaha"
    ]
  },
  "actions": {
    "backToMailbox": "Ku laabo sanduuqa boostada",
    "reload": "Nasiin",
    "select": "Xullo",
    "markAsUnread": "Calaamadee sida aan la aqrin",
    "markAsRead": "Calaamadee sida loo akhriyay",
    "moveTo": "U dhaqaaq",
    "delete": "Tirtir",
    "deletePermanently": "Tirtir si joogto ah",
    "discardDrafts": "Tuur qoraalada",
    "markAsSpam": "Ku calaamadee spam ahaan",
    "unMarkAsSpam": "Tani maahan spam",
    "forward": "Hore u soco",
    "reply": "Jawaab",
    "attachments": "Ku lifaaqan"
  },
  "weekDays": {
    "0": "Axad",
    "1": "Isniinta",
    "2": "Talaado",
    "3": "Arbacada",
    "4": "Khamiista",
    "5": "Jimce",
    "6": "Sabti"
  },
  "months": {
    "0": "Janawari",
    "1": "Febraayo",
    "2": "Maarso",
    "3": "Abriil",
    "4": "Laga yaabaa",
    "5": "Jun",
    "6": "Luulyo",
    "7": "Ogast",
    "8": "Sebtember",
    "9": "Oktoobar",
    "10": "Nofeembar",
    "11": "Diseembar"
  },
  "notifier": {
    "messageSent": "Farriin baa la diray",
    "mailboxDeleted": "Faylka waa la tirtiray"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Fayl cusub",
      "success": "Faylka waa la abuuray"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Abuur fayl cusub",
      "label": "Magaca faylka",
      "accept": "Abuur",
      "cancel": "Tirtir"
    },
    "deleteMailbox": {
      "title": "Tirtir faylka \"{mailbox}\"",
      "desc": "Digniin. Tallaabadani waxay tirtireysaa si joogto ah dhammaan fariimaha kujira galka",
      "accept": "Tirtir",
      "cancel": "Tirtir"
    }
  },
  "myAccount": {
    "title": "Xisaabteyda",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "ee {gb} GB",
      "messagesUsed": [
        "{n} farriimaha",
        "{n} farriin",
        "{n} farriimaha"
      ],
      "messagesTotal": [
        "ee {n} farriimaha",
        "ee {n} farriinta",
        "ee {n} farriimaha"
      ],
      "storage": {
        "title": "Kaydinta"
      },
      "imapDownload": {
        "title": "Soo dejinta IMAP",
        "comment": "maalin kasta"
      },
      "imapUpload": {
        "title": "Soo dejinta IMAP",
        "comment": "maalin kasta"
      },
      "pop3Download": {
        "title": "Soo dejiso POP3",
        "comment": "maalin kasta"
      },
      "received": {
        "title": "Helay",
        "comment": "daqiiqad"
      },
      "recipients": {
        "title": "Diray",
        "comment": "maalin kasta"
      },
      "forwards": {
        "title": "Diidmo",
        "comment": "maalin kasta"
      }
    }
  }
};

export default locale;