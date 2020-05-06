import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Bogsa a-steach",
      "sent": "Air a chuir",
      "drafts": "Dreachan",
      "trash": "Sgudal",
      "junk": "Spama"
    },
    "empty": "Tha am bogsa puist seo falamh"
  },
  "message": {
    "labels": {
      "from": "Bho:",
      "to": "Gu:",
      "date": "Air a chuir:"
    }
  },
  "mailboxMessage": {
    "to": "Gu:"
  },
  "login": {
    "title": "Soidhnig a-steach",
    "action": "Soidhnig a-steach",
    "labels": {
      "username": "Ainm-cleachdaidh",
      "password": "Facal-faire"
    }
  },
  "accountButton": {
    "logout": "Soidhnig a-mach",
    "myAccount": "Mo chunntas"
  },
  "compose": {
    "labels": {
      "to": "Gu:",
      "subject": "Cuspair:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Teachdaireachd ùr"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Undo",
      "redo": "Dèan ath-dhèanamh",
      "fontName": "Seòrsa cruth-clò",
      "fontSize": "Meud cruth",
      "bold": "Trom",
      "italic": "Eadailteach",
      "underline": "Fo-loidhne",
      "justifyLeft": "Co-thaobhadh ris an làimh chlì",
      "justifyCenter": "Co-thaobhadh meadhan",
      "justifyRight": "Co-thaobhadh ceart",
      "insertUnorderedList": "Liosta",
      "insertOrderedList": "Liosta le àireamhan",
      "removeFormat": "Thoir air falbh cruth"
    },
    "color": {
      "tooltip": "Dath",
      "foreColor": "Teacs",
      "backColor": "Cùl-fhiosrachadh"
    },
    "upload": {
      "tooltip": "Ceangail",
      "add": "Cuir ris",
      "remove": "Thoir air falbh"
    },
    "send": "Cuir"
  },
  "selection": {
    "title": [
      "{n} teachdaireachdan",
      "{n} teachdaireachd",
      "{n} teachdaireachdan"
    ]
  },
  "actions": {
    "backToMailbox": "Air ais chun bhogsa puist",
    "reload": "Ùraich",
    "select": "Tagh",
    "markAsUnread": "Comharraich mar nach deach a leughadh",
    "markAsRead": "Comharraich mar a chaidh a leughadh",
    "moveTo": "Gluais gu",
    "delete": "Cuir às",
    "deletePermanently": "Cuir às gu maireannach",
    "discardDrafts": "Tilg air falbh dreachan",
    "markAsSpam": "Comharraich mar spama",
    "unMarkAsSpam": "Chan e spama a tha seo",
    "forward": "Air adhart",
    "reply": "Freagairt",
    "attachments": "Ceangail"
  },
  "weekDays": {
    "0": "Didòmhnaich",
    "1": "Diluain",
    "2": "Dimàirt",
    "3": "Diciadain",
    "4": "Diardaoin",
    "5": "Dihaoine",
    "6": "Disathairne"
  },
  "months": {
    "0": "Am Faoilleach",
    "1": "An Gearran",
    "2": "Am Màrt",
    "3": "A 'Ghiblean",
    "4": "A 'Chèitean",
    "5": "Jun",
    "6": "An t-Iuchar",
    "7": "An Lùnastal",
    "8": "An t-Sultain",
    "9": "An Dàmhair",
    "10": "An t-Samhain",
    "11": "An Dùbhlachd"
  },
  "notifier": {
    "messageSent": "Teachdaireachd air a chuir"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Pasgan ùr",
      "success": "Folder air a chruthachadh"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Cruthaich pasgan ùr",
      "label": "Ainm fillte",
      "accept": "Cruthaich",
      "cancel": "Sguir dheth"
    }
  },
  "myAccount": {
    "title": "Mo chunntas",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "de {gb} GB",
      "messagesUsed": [
        "{n} teachdaireachdan",
        "{n} teachdaireachd",
        "{n} teachdaireachdan"
      ],
      "messagesTotal": [
        "de {n} teachdaireachdan",
        "de {n} teachdaireachd",
        "de {n} teachdaireachdan"
      ],
      "storage": {
        "title": "Stòradh"
      },
      "imapDownload": {
        "title": "Luchdaich sìos IMAP",
        "comment": "gach latha"
      },
      "imapUpload": {
        "title": "Luchdaich suas IMAP",
        "comment": "gach latha"
      },
      "pop3Download": {
        "title": "Luchdaich sìos POP3",
        "comment": "gach latha"
      },
      "received": {
        "title": "Fhuair",
        "comment": "sa mhionaid"
      },
      "recipients": {
        "title": "Air a chuir",
        "comment": "gach latha"
      },
      "forwards": {
        "title": "Ath-stiùireadh",
        "comment": "gach latha"
      }
    }
  }
};

export default locale;