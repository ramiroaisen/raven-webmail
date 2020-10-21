import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "inbuxo",
      "sent": "missus",
      "drafts": "Rudia",
      "trash": "quisquiliae",
      "junk": "spam"
    },
    "delete": "Delete folder",
    "empty": "Hic est mailbox inanis"
  },
  "message": {
    "labels": {
      "from": "from:",
      "to": "Ad:",
      "date": "missum;"
    }
  },
  "mailboxMessage": {
    "to": "Ad:"
  },
  "login": {
    "title": "Inscribe",
    "action": "Inscribe",
    "labels": {
      "username": "nomen usoris",
      "password": "Password"
    }
  },
  "accountButton": {
    "logout": "Exscribe",
    "myAccount": "Propter me",
    "filters": "Filtra"
  },
  "compose": {
    "labels": {
      "to": "Ad:",
      "subject": "re:",
      "cc": "ad alium:",
      "bcc": "Antigraphum:"
    },
    "tabs": {
      "newMessageTitle": "Mandatum novum"
    }
  },
  "editor": {
    "cmd": {
      "undo": "undo",
      "redo": "redo",
      "fontName": "font genus",
      "fontSize": "font magnitudine",
      "bold": "audax",
      "italic": "Italica",
      "underline": "Intimum efferentes",
      "justifyLeft": "Conlinis sinistram",
      "justifyCenter": "media Conlinis",
      "justifyRight": "ius Conlinis",
      "insertUnorderedList": "album",
      "insertOrderedList": "Numerus inventarium",
      "removeFormat": "Aufer forma"
    },
    "color": {
      "tooltip": "color",
      "foreColor": "text",
      "backColor": "Maecenas vitae"
    },
    "upload": {
      "tooltip": "Documentum affigere",
      "add": "addere",
      "remove": "Aufer"
    },
    "send": "Mitte"
  },
  "selection": {
    "title": [
      "{undefined} epistulae",
      "{undefined} nuntius",
      "{undefined} epistulae"
    ]
  },
  "actions": {
    "backToMailbox": "Ad mailbox",
    "reload": "Renovare",
    "select": "select",
    "markAsUnread": "Non quasi signum legere",
    "markAsRead": "quod signum legere",
    "moveTo": "movere",
    "delete": "Delete",
    "deletePermanently": "delere in perpetuum",
    "discardDrafts": "Rudia Relinquere",
    "markAsSpam": "Mark quod ut spamma annotatum",
    "unMarkAsSpam": "Hoc non spamma",
    "forward": "ante",
    "reply": "Respondeo",
    "attachments": "attachiamenta"
  },
  "weekDays": {
    "0": "Solis",
    "1": "dies Lunae",
    "2": "Martis",
    "3": "Mercurii",
    "4": "Iovis",
    "5": "Veneris",
    "6": "Saturni"
  },
  "months": {
    "0": "Ianuarii",
    "1": "Februarius",
    "2": "Martii",
    "3": "Aprilis",
    "4": "May",
    "5": "Iun",
    "6": "Iulii",
    "7": "August",
    "8": "September",
    "9": "Octobris",
    "10": "November",
    "11": "December"
  },
  "notifier": {
    "messageSent": "nuntium misit",
    "mailboxDeleted": "folder delevit"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Collectorium novum",
      "success": "folder creata est"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Create novi folder",
      "label": "folder est nomen",
      "accept": "Create",
      "cancel": "Cancel"
    },
    "deleteMailbox": {
      "title": "Delete folder \"{undefined} '",
      "desc": "Scribitur. Haec actio in perpetuum Omnes epistulae in folder mos delete",
      "accept": "Delete",
      "cancel": "Cancel"
    }
  },
  "myAccount": {
    "title": "Propter me",
    "commonActions": {
      "title": "communis actus",
      "updatePassword": "Update password",
      "currentPassword": "Tessera hicce",
      "newPassword": "novus absconditus verbem",
      "confirmPassword": "Confirmare New password"
    },
    "limits": {
      "gbUsed": "{undefined} MB",
      "gbTotal": "} {GB ex I",
      "messagesUsed": [
        "{undefined} epistulae",
        "{undefined} nuntius",
        "{undefined} epistulae"
      ],
      "messagesTotal": [
        "{undefined} ex epistulae",
        "{undefined} I nuntius",
        "{undefined} ex epistulae"
      ],
      "storage": {
        "title": "storage"
      },
      "imapDownload": {
        "title": "IMAP Download",
        "comment": "cotidie"
      },
      "imapUpload": {
        "title": "Index IMAP",
        "comment": "cotidie"
      },
      "pop3Download": {
        "title": "POP3 Download",
        "comment": "cotidie"
      },
      "received": {
        "title": "suscepit",
        "comment": "a minute"
      },
      "recipients": {
        "title": "missus",
        "comment": "cotidie"
      },
      "forwards": {
        "title": "Redirigens",
        "comment": "cotidie"
      }
    }
  },
  "filters": {
    "title": "Filtra",
    "commingSoon": "Mox adventu"
  }
};

export default locale;