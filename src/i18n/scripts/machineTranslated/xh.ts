import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "Kuthunyelwe",
      "drafts": "Uyilo",
      "trash": "Inkunkuma",
      "junk": "Ispemu"
    },
    "empty": "Le bhokisi yeposi ayinanto"
  },
  "message": {
    "labels": {
      "from": "Isuka:",
      "to": "Iya:",
      "date": "Ithunyelwe:"
    }
  },
  "mailboxMessage": {
    "to": "Iya:"
  },
  "login": {
    "title": "Ngena",
    "action": "Ngena",
    "labels": {
      "username": "Igama lomsebenzisi",
      "password": "Inombolo yokuvula"
    }
  },
  "accountButton": {
    "logout": "Phuma",
    "myAccount": "I-akhawunti yam"
  },
  "compose": {
    "labels": {
      "to": "Iya:",
      "subject": "Umxholo:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Umyalezo omtsha"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Hlehlisa",
      "redo": "Phinda wenze",
      "fontName": "Uhlobo lwefonti",
      "fontSize": "Isayizi yefonti",
      "bold": "Bold",
      "italic": "Ithalal",
      "underline": "Krwela umgca",
      "justifyLeft": "Lungelelanisa ngasekhohlo",
      "justifyCenter": "Lungelelanisa phakathi",
      "justifyRight": "Lungelelanisa ngokuchanekileyo",
      "insertUnorderedList": "Uluhlu",
      "insertOrderedList": "Uluhlu olunamanani",
      "removeFormat": "Susa ifomathi"
    },
    "color": {
      "tooltip": "Umbala",
      "foreColor": "Isicatshulwa",
      "backColor": "Imvelaphi"
    },
    "upload": {
      "tooltip": "Qhoboshela",
      "add": "Yongeza",
      "remove": "Susa"
    },
    "send": "Thumela"
  },
  "selection": {
    "title": [
      "{n} imiyalezo",
      "{n} umyalezo",
      "{n} imiyalezo"
    ]
  },
  "actions": {
    "backToMailbox": "Buyela kwibhokisi yeposi",
    "reload": "Qalela ngokutsha",
    "select": "Khetha",
    "markAsUnread": "Phawula njengengafundwanga",
    "markAsRead": "Phawula njengokufundiweyo",
    "moveTo": "Dlulela ku",
    "delete": "Cima",
    "deletePermanently": "Cima isigxina",
    "discardDrafts": "Lahla uyilo",
    "markAsSpam": "Phawula njengogaxekile",
    "unMarkAsSpam": "Ayisiyogaxekile",
    "forward": "Phambili",
    "reply": "Phendula",
    "attachments": "Okuqhotyoshelwe apha"
  },
  "weekDays": {
    "0": "iCawe",
    "1": "uMvulo",
    "2": "uLwesibini",
    "3": "uLwesithathu",
    "4": "uLwesine",
    "5": "uLwesihlanu",
    "6": "uMgqibelo"
  },
  "months": {
    "0": "EyoMqungu",
    "1": "EyoMdumba",
    "2": "EyoKwindla",
    "3": "UTshazimpuzi",
    "4": "UCanzibe",
    "5": "Jun",
    "6": "EyeKhala",
    "7": "EyeThupha",
    "8": "EyoMsintsi",
    "9": "EyeDwarha",
    "10": "EyeNkanga",
    "11": "EtiMnga"
  },
  "notifier": {
    "messageSent": "Umyalezo uthunyelwe"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Ifolda entsha",
      "success": "Ifolda yenziwe"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Yenza incwadi entsha",
      "label": "Igama lefolda",
      "accept": "Yenza",
      "cancel": "Rhoxisa"
    }
  },
  "myAccount": {
    "title": "I-akhawunti yam",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "ye {gb} GB",
      "messagesUsed": [
        "{n} imiyalezo",
        "{n} umyalezo",
        "{n} imiyalezo"
      ],
      "messagesTotal": [
        "yemiyalezo eyi- (1)",
        "yomyalezo {n}",
        "yemiyalezo eyi- (1)"
      ],
      "storage": {
        "title": "Ukugcina"
      },
      "imapDownload": {
        "title": "Ukhuphelo lwe-IMAP",
        "comment": "mihla le"
      },
      "imapUpload": {
        "title": "Ukulayisha kwe-IMAP",
        "comment": "mihla le"
      },
      "pop3Download": {
        "title": "POP3 Khuphela",
        "comment": "mihla le"
      },
      "received": {
        "title": "Ifunyenwe",
        "comment": "ngomzuzu"
      },
      "recipients": {
        "title": "Kuthunyelwe",
        "comment": "mihla le"
      },
      "forwards": {
        "title": "Iqondiswe kwakhona",
        "comment": "mihla le"
      }
    }
  }
};

export default locale;