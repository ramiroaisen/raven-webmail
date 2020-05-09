import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "Trimis",
      "drafts": "Schițe",
      "trash": "Gunoi",
      "junk": "Spam"
    },
    "delete": "Ștergeți folderul",
    "empty": "Această căsuță poștală este goală"
  },
  "message": {
    "labels": {
      "from": "Din:",
      "to": "La:",
      "date": "Trimis:"
    }
  },
  "mailboxMessage": {
    "to": "La:"
  },
  "login": {
    "title": "conectare",
    "action": "conectare",
    "labels": {
      "username": "Nume de utilizator",
      "password": "Parola"
    }
  },
  "accountButton": {
    "logout": "Sign out",
    "myAccount": "Contul meu",
    "filters": "Filtre"
  },
  "compose": {
    "labels": {
      "to": "La:",
      "subject": "Subiect:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Mesaj nou"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Anula",
      "redo": "A reface",
      "fontName": "Tipul fontului",
      "fontSize": "Marimea fontului",
      "bold": "Îndrăzneţ",
      "italic": "Cursiv",
      "underline": "subliniere",
      "justifyLeft": "Alinia la stânga",
      "justifyCenter": "Aliniați mijlocul",
      "justifyRight": "Aliniați dreapta",
      "insertUnorderedList": "Listă",
      "insertOrderedList": "Lista numerotată",
      "removeFormat": "Ștergeți formatul"
    },
    "color": {
      "tooltip": "Culoare",
      "foreColor": "Text",
      "backColor": "fundal"
    },
    "upload": {
      "tooltip": "atașa",
      "add": "Adăuga",
      "remove": "Elimina"
    },
    "send": "Trimite"
  },
  "selection": {
    "title": [
      "{1 Mesaje",
      "{n} mesaj",
      "{1 Mesaje"
    ]
  },
  "actions": {
    "backToMailbox": "Înapoi la căsuța poștală",
    "reload": "Reîmprospăta",
    "select": "Selectați",
    "markAsUnread": "Marcați cum nu ați citit",
    "markAsRead": "marcheaza ca citit",
    "moveTo": "Treceți la",
    "delete": "Șterge",
    "deletePermanently": "Sterge Permanent",
    "discardDrafts": "Renunțați la schițele",
    "markAsSpam": "marchează ca spam",
    "unMarkAsSpam": "Acesta nu este spam",
    "forward": "Redirecţiona",
    "reply": "Răspuns",
    "attachments": "Fișiere atașate"
  },
  "weekDays": {
    "0": "duminică",
    "1": "luni",
    "2": "marţi",
    "3": "miercuri",
    "4": "joi",
    "5": "vineri",
    "6": "sâmbătă"
  },
  "months": {
    "0": "ianuarie",
    "1": "februarie",
    "2": "Martie",
    "3": "Aprilie",
    "4": "Mai",
    "5": "Iunie",
    "6": "iulie",
    "7": "August",
    "8": "Septembrie",
    "9": "octombrie",
    "10": "noiembrie",
    "11": "decembrie"
  },
  "notifier": {
    "messageSent": "Mesaj trimis",
    "mailboxDeleted": "Folder șters"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Dosar nou",
      "success": "Folder creat"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Creati un folder nou",
      "label": "Numele fisierului",
      "accept": "Crea",
      "cancel": "Anulare"
    },
    "deleteMailbox": {
      "title": "Ștergeți folderul „{mailbox}”",
      "desc": "Prudență. Această acțiune va șterge permanent toate mesajele din folder",
      "accept": "Șterge",
      "cancel": "Anulare"
    }
  },
  "myAccount": {
    "title": "Contul meu",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "din {gb} GB",
      "messagesUsed": [
        "{1 Mesaje",
        "{n} mesaj",
        "{1 Mesaje"
      ],
      "messagesTotal": [
        "din {n} mesaje",
        "din mesajul {n}",
        "din {n} mesaje"
      ],
      "storage": {
        "title": "Depozitare"
      },
      "imapDownload": {
        "title": "Descărcare IMAP",
        "comment": "zilnic"
      },
      "imapUpload": {
        "title": "Încărcare IMAP",
        "comment": "zilnic"
      },
      "pop3Download": {
        "title": "Descărcare POP3",
        "comment": "zilnic"
      },
      "received": {
        "title": "Primit",
        "comment": "la minut"
      },
      "recipients": {
        "title": "Trimis",
        "comment": "zilnic"
      },
      "forwards": {
        "title": "redirecţionată",
        "comment": "zilnic"
      }
    }
  },
  "filters": {
    "title": "Filtre",
    "commingSoon": "In curand"
  }
};

export default locale;