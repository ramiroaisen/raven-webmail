import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Innhólf",
      "sent": "Sent",
      "drafts": "Drög",
      "trash": "Rusl",
      "junk": "Ruslpóstur"
    },
    "delete": "Eyða möppu",
    "empty": "Þetta pósthólf er tómt"
  },
  "message": {
    "labels": {
      "from": "Frá:",
      "to": "Til:",
      "date": "Sent:"
    }
  },
  "mailboxMessage": {
    "to": "Til:"
  },
  "login": {
    "title": "Skráðu þig inn",
    "action": "Skráðu þig inn",
    "labels": {
      "username": "Notandanafn",
      "password": "Lykilorð"
    }
  },
  "accountButton": {
    "logout": "Útskrá",
    "myAccount": "Minn reikningur"
  },
  "compose": {
    "labels": {
      "to": "Til:",
      "subject": "Efni:",
      "cc": "Afrit:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Ný skilaboð"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Afturkalla",
      "redo": "Endurtaka",
      "fontName": "Leturgerð",
      "fontSize": "Leturstærð",
      "bold": "Djarfur",
      "italic": "Skáletrað",
      "underline": "Undirstrikaðu",
      "justifyLeft": "Samræma vinstri",
      "justifyCenter": "Samræma miðju",
      "justifyRight": "Samræma rétt",
      "insertUnorderedList": "Listi",
      "insertOrderedList": "Númeraður listi",
      "removeFormat": "Fjarlægðu snið"
    },
    "color": {
      "tooltip": "Litur",
      "foreColor": "Texti",
      "backColor": "Bakgrunnur"
    },
    "upload": {
      "tooltip": "Hengdu",
      "add": "Bæta við",
      "remove": "Fjarlægðu"
    },
    "send": "Senda"
  },
  "selection": {
    "title": [
      "{n} skilaboð",
      "{n} skilaboð",
      "{n} skilaboð"
    ]
  },
  "actions": {
    "backToMailbox": "Aftur í pósthólfið",
    "reload": "Endurnærðu",
    "select": "Veldu",
    "markAsUnread": "Merktu sem ekki lesið",
    "markAsRead": "merkja sem lesið",
    "moveTo": "Flytja til",
    "delete": "Eyða",
    "deletePermanently": "Eyða varanlega",
    "discardDrafts": "Fleygja drögum",
    "markAsSpam": "Merkja sem ruslpóst",
    "unMarkAsSpam": "Þetta er ekki ruslpóstur",
    "forward": "Áfram",
    "reply": "Svaraðu",
    "attachments": "Viðhengi"
  },
  "weekDays": {
    "0": "Sunnudag",
    "1": "Mánudagur",
    "2": "Þriðjudag",
    "3": "Miðvikudag",
    "4": "Fimmtudag",
    "5": "Föstudag",
    "6": "Laugardag"
  },
  "months": {
    "0": "Janúar",
    "1": "Febrúar",
    "2": "Mars",
    "3": "Apríl",
    "4": "Maí",
    "5": "Júní",
    "6": "Júlí",
    "7": "Ágúst",
    "8": "September",
    "9": "október",
    "10": "Nóvember",
    "11": "Desember"
  },
  "notifier": {
    "messageSent": "Skilaboð send",
    "mailboxDeleted": "Mappa eytt"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Ný mappa",
      "success": "Mappa búin til"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Búðu til nýja möppu",
      "label": "Mappanafn",
      "accept": "Búa til",
      "cancel": "Hætta við"
    },
    "deleteMailbox": {
      "title": "Eyða möppunni „{mailbox}“",
      "desc": "Varúð. Þessi aðgerð mun eyða öllum skilaboðum í möppunni varanlega",
      "accept": "Eyða",
      "cancel": "Hætta við"
    }
  },
  "myAccount": {
    "title": "Minn reikningur",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "af {gb} GB",
      "messagesUsed": [
        "{n} skilaboð",
        "{n} skilaboð",
        "{n} skilaboð"
      ],
      "messagesTotal": [
        "af {n} skilaboðum",
        "af {n} skilaboðum",
        "af {n} skilaboðum"
      ],
      "storage": {
        "title": "Geymsla"
      },
      "imapDownload": {
        "title": "IMAP niðurhal",
        "comment": "daglega"
      },
      "imapUpload": {
        "title": "IMAP upphleðsla",
        "comment": "daglega"
      },
      "pop3Download": {
        "title": "POP3 niðurhal",
        "comment": "daglega"
      },
      "received": {
        "title": "Móttekið",
        "comment": "eftir mínútu"
      },
      "recipients": {
        "title": "Sent",
        "comment": "daglega"
      },
      "forwards": {
        "title": "Beint",
        "comment": "daglega"
      }
    }
  }
};

export default locale;