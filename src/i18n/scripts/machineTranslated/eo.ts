import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Informkesto",
      "sent": "Sendita",
      "drafts": "Skizoj",
      "trash": "Rubo",
      "junk": "Spamo"
    },
    "empty": "Ĉi tiu retpoŝto estas malplena"
  },
  "message": {
    "labels": {
      "from": "De:",
      "to": "Al:",
      "date": "Sendita:"
    }
  },
  "mailboxMessage": {
    "to": "Al:"
  },
  "login": {
    "title": "Ensaluti",
    "action": "Ensaluti",
    "labels": {
      "username": "Uzantnomo",
      "password": "Pasvorto"
    }
  },
  "accountButton": {
    "logout": "Elsaluti",
    "myAccount": "Mia konto"
  },
  "compose": {
    "labels": {
      "to": "Al:",
      "subject": "Subjekto:",
      "cc": "Ĉĉ:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Nova mesaĝo"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Malfari",
      "redo": "Malŝalti",
      "fontName": "Tiparo de tiparo",
      "fontSize": "Tiparo",
      "bold": "Aŭdaca",
      "italic": "Itala",
      "underline": "Sublinii",
      "justifyLeft": "Aliĝi maldekstren",
      "justifyCenter": "Aliĝi meze",
      "justifyRight": "Aliĝu ĝuste",
      "insertUnorderedList": "Listo",
      "insertOrderedList": "Numerada listo",
      "removeFormat": "Forigi formaton"
    },
    "color": {
      "tooltip": "Koloro",
      "foreColor": "Teksto",
      "backColor": "Fono"
    },
    "upload": {
      "tooltip": "Ligu",
      "add": "Aldoni",
      "remove": "Forigi"
    },
    "send": "Sendu"
  },
  "selection": {
    "title": [
      "{n} mesaĝoj",
      "{n} mesaĝo",
      "{n} mesaĝoj"
    ]
  },
  "actions": {
    "backToMailbox": "Reen al leterkesto",
    "reload": "Refreŝigi",
    "select": "Elektu",
    "markAsUnread": "Marki kiel ne legita",
    "markAsRead": "Marki kiel legita",
    "moveTo": "Movi al",
    "delete": "Forigi",
    "deletePermanently": "Forigi permanente",
    "discardDrafts": "Forĵetas projektojn",
    "markAsSpam": "Marki kiel spamo",
    "unMarkAsSpam": "Ĉi tio ne estas spamo",
    "forward": "Antaŭen",
    "reply": "Respondu",
    "attachments": "Aldonaĵoj"
  },
  "weekDays": {
    "0": "dimanĉo",
    "1": "Lundon",
    "2": "Marde",
    "3": "Merkredo",
    "4": "Ĵaŭdo",
    "5": "Vendredo",
    "6": "Sabato"
  },
  "months": {
    "0": "Januaro",
    "1": "Februaro",
    "2": "Marto",
    "3": "Aprilo",
    "4": "Majo",
    "5": "Jun",
    "6": "Julio",
    "7": "Aŭgusto",
    "8": "Septembro",
    "9": "Oktobro",
    "10": "Novembro",
    "11": "Decembro"
  },
  "notifier": {
    "messageSent": "Mesaĝo sendita"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nova dosierujo",
      "success": "Dosiero kreita"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Krei novan dosierujon",
      "label": "Nomo de dosierujo",
      "accept": "Krei",
      "cancel": "Nuligi"
    }
  },
  "myAccount": {
    "title": "Mia konto",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "de {gb} GB",
      "messagesUsed": [
        "{n} mesaĝoj",
        "{n} mesaĝo",
        "{n} mesaĝoj"
      ],
      "messagesTotal": [
        "de {n} mesaĝoj",
        "de {n} mesaĝo",
        "de {n} mesaĝoj"
      ],
      "storage": {
        "title": "Stokado"
      },
      "imapDownload": {
        "title": "Elŝuta IMAP",
        "comment": "ĉiutage"
      },
      "imapUpload": {
        "title": "Alŝuto de IMAP",
        "comment": "ĉiutage"
      },
      "pop3Download": {
        "title": "Elŝuti POP3",
        "comment": "ĉiutage"
      },
      "received": {
        "title": "Ricevita",
        "comment": "minuton"
      },
      "recipients": {
        "title": "Sendita",
        "comment": "ĉiutage"
      },
      "forwards": {
        "title": "Alidirektita",
        "comment": "ĉiutage"
      }
    }
  }
};

export default locale;