import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Iesūtne",
      "sent": "Nosūtīts",
      "drafts": "Melnraksti",
      "trash": "Atkritumi",
      "junk": "Spams"
    },
    "delete": "Dzēst mapi",
    "empty": "Šī pastkaste ir tukša"
  },
  "message": {
    "labels": {
      "from": "No:",
      "to": "Kam:",
      "date": "Nosūtīts:"
    }
  },
  "mailboxMessage": {
    "to": "Kam:"
  },
  "login": {
    "title": "Ielogoties",
    "action": "Ielogoties",
    "labels": {
      "username": "Lietotājvārds",
      "password": "Parole"
    }
  },
  "accountButton": {
    "logout": "Izrakstīties",
    "myAccount": "Mans Konts"
  },
  "compose": {
    "labels": {
      "to": "Kam:",
      "subject": "Temats:",
      "cc": "Kopija:",
      "bcc": "Diskrētā kopija:"
    },
    "tabs": {
      "newMessageTitle": "Jauna ziņa"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Atsaukt",
      "redo": "Atkārtot",
      "fontName": "Fonta tips",
      "fontSize": "Fonta izmērs",
      "bold": "Bold",
      "italic": "Kursīvs",
      "underline": "Pasvītrojums",
      "justifyLeft": "Izlīdziniet pa kreisi",
      "justifyCenter": "Izlīdziniet vidu",
      "justifyRight": "Izlīdziniet labi",
      "insertUnorderedList": "Saraksts",
      "insertOrderedList": "Numurēts saraksts",
      "removeFormat": "Noņemt formātu"
    },
    "color": {
      "tooltip": "Krāsa",
      "foreColor": "Teksts",
      "backColor": "Pamatinformācija"
    },
    "upload": {
      "tooltip": "Pievienojiet",
      "add": "Pievienot",
      "remove": "Noņemt"
    },
    "send": "Sūtīt"
  },
  "selection": {
    "title": [
      "{n} ziņojumi",
      "{n} ziņojums",
      "{n} ziņojumi"
    ]
  },
  "actions": {
    "backToMailbox": "Atpakaļ uz pastkasti",
    "reload": "atjaunot",
    "select": "Izvēlieties",
    "markAsUnread": "Atzīmēt kā nelasītu",
    "markAsRead": "Atzīmēt kā lasītu",
    "moveTo": "Pārvietot uz",
    "delete": "Dzēst",
    "deletePermanently": "Dzēst neatgriezeniski",
    "discardDrafts": "Izmetiet melnrakstus",
    "markAsSpam": "atzīmēt kā mēstuli",
    "unMarkAsSpam": "Tas nav surogātpasts",
    "forward": "Uz priekšu",
    "reply": "Atbildi",
    "attachments": "Pielikumi"
  },
  "weekDays": {
    "0": "Svētdien",
    "1": "Pirmdien",
    "2": "Otrdiena",
    "3": "Trešdien",
    "4": "Ceturtdiena",
    "5": "Piektdiena",
    "6": "Sestdien"
  },
  "months": {
    "0": "Janvārī",
    "1": "Februāris",
    "2": "Martā",
    "3": "Aprīlī",
    "4": "Maijā",
    "5": "Jūnijs",
    "6": "Jūlijs",
    "7": "augusts",
    "8": "Septembrī",
    "9": "Oktobris",
    "10": "Novembrī",
    "11": "Decembrī"
  },
  "notifier": {
    "messageSent": "Ziņa nosūtīta",
    "mailboxDeleted": "Mape ir izdzēsta"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Jauna mape",
      "success": "Mape izveidota"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Izveidot jaunu mapi",
      "label": "Mapes nosaukums",
      "accept": "Izveidot",
      "cancel": "Atcelt"
    },
    "deleteMailbox": {
      "title": "Dzēst mapi “{mailbox}”",
      "desc": "Uzmanību. Šī darbība neatgriezeniski izdzēsīs visus mapē esošos ziņojumus",
      "accept": "Dzēst",
      "cancel": "Atcelt"
    }
  },
  "myAccount": {
    "title": "Mans Konts",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "no {gb} GB",
      "messagesUsed": [
        "{n} ziņojumi",
        "{n} ziņojums",
        "{n} ziņojumi"
      ],
      "messagesTotal": [
        "no {n} ziņojumiem",
        "no {n} ziņojuma",
        "no {n} ziņojumiem"
      ],
      "storage": {
        "title": "Uzglabāšana"
      },
      "imapDownload": {
        "title": "IMAP lejupielāde",
        "comment": "katru dienu"
      },
      "imapUpload": {
        "title": "IMAP augšupielāde",
        "comment": "katru dienu"
      },
      "pop3Download": {
        "title": "POP3 lejupielāde",
        "comment": "katru dienu"
      },
      "received": {
        "title": "Saņemts",
        "comment": "pa minūti"
      },
      "recipients": {
        "title": "Nosūtīts",
        "comment": "katru dienu"
      },
      "forwards": {
        "title": "Novirzīts",
        "comment": "katru dienu"
      }
    }
  }
};

export default locale;