import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "Yoherejwe",
      "drafts": "Inyandiko",
      "trash": "Imyanda",
      "junk": "Spam"
    },
    "delete": "Siba ububiko",
    "empty": "Agasanduku k'iposita karimo ubusa"
  },
  "message": {
    "labels": {
      "from": "Kuva:",
      "to": "Kuri:",
      "date": "Yoherejwe:"
    }
  },
  "mailboxMessage": {
    "to": "Kuri:"
  },
  "login": {
    "title": "Injira",
    "action": "Injira",
    "labels": {
      "username": "Izina ryukoresha",
      "password": "Ijambobanga"
    }
  },
  "accountButton": {
    "logout": "Sohoka",
    "myAccount": "Konti yanjye",
    "filters": "Muyunguruzi"
  },
  "compose": {
    "labels": {
      "to": "Kuri:",
      "subject": "Ingingo:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Ubutumwa bushya"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Kuraho",
      "redo": "Ongera",
      "fontName": "Ubwoko bw'imyandikire",
      "fontSize": "Ingano yimyandikire",
      "bold": "Ubutinyutsi",
      "italic": "Ubutaliyani",
      "underline": "Shyira umurongo",
      "justifyLeft": "Huza ibumoso",
      "justifyCenter": "Huza hagati",
      "justifyRight": "Huza iburyo",
      "insertUnorderedList": "Urutonde",
      "insertOrderedList": "Urutonde",
      "removeFormat": "Kuraho imiterere"
    },
    "color": {
      "tooltip": "Ibara",
      "foreColor": "Inyandiko",
      "backColor": "Amavu n'amavuko"
    },
    "upload": {
      "tooltip": "Ongeraho",
      "add": "Ongeraho",
      "remove": "Kuraho"
    },
    "send": "Ohereza"
  },
  "selection": {
    "title": [
      "{n} ubutumwa",
      "{n} ubutumwa",
      "{n} ubutumwa"
    ]
  },
  "actions": {
    "backToMailbox": "Subira ku gasanduku k'iposita",
    "reload": "Ongera",
    "select": "Hitamo",
    "markAsUnread": "Shyira akamenyetso ko udasomwe",
    "markAsRead": "Shyira akamenyetso nkuko wasomwe",
    "moveTo": "Himura kuri",
    "delete": "Siba",
    "deletePermanently": "Siba burundu",
    "discardDrafts": "Hagarika imishinga",
    "markAsSpam": "Shyira ahagaragara spam",
    "unMarkAsSpam": "Iyi ntabwo ari spam",
    "forward": "Imbere",
    "reply": "Subiza",
    "attachments": "Umugereka"
  },
  "weekDays": {
    "0": "Ku cyumweru",
    "1": "Ku wa mbere",
    "2": "Ku wa kabiri",
    "3": "Ku wa gatatu",
    "4": "Ku wa kane",
    "5": "Ku wa gatanu",
    "6": "Ku wa gatandatu"
  },
  "months": {
    "0": "Mutarama",
    "1": "Gashyantare",
    "2": "Werurwe",
    "3": "Mata",
    "4": "Gicurasi",
    "5": "Jun",
    "6": "Nyakanga",
    "7": "Kanama",
    "8": "Nzeri",
    "9": "Ukwakira",
    "10": "Ugushyingo",
    "11": "Kigarama"
  },
  "notifier": {
    "messageSent": "Ubutumwa bwoherejwe",
    "mailboxDeleted": "Ububiko bwasibwe"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Ububiko bushya",
      "success": "Ububiko bwakozwe"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Kora ububiko bushya",
      "label": "Izina ry'ububiko",
      "accept": "Kurema",
      "cancel": "Kureka"
    },
    "deleteMailbox": {
      "title": "Siba ububiko \"{mailbox}\"",
      "desc": "Icyitonderwa. Igikorwa kizasiba burundu ubutumwa bwose mububiko",
      "accept": "Siba",
      "cancel": "Kureka"
    }
  },
  "myAccount": {
    "title": "Konti yanjye",
    "commonActions": {
      "title": "Ibikorwa bisanzwe",
      "updatePassword": "Kuvugurura ijambo ryibanga",
      "currentPassword": "Ijambobanga ryubu",
      "newPassword": "Ijambobanga rishya",
      "confirmPassword": "Emeza ijambo ryibanga rishya"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "ya {gb} GB",
      "messagesUsed": [
        "{n} ubutumwa",
        "{n} ubutumwa",
        "{n} ubutumwa"
      ],
      "messagesTotal": [
        "ya {n} ubutumwa",
        "ya {n} ubutumwa",
        "ya {n} ubutumwa"
      ],
      "storage": {
        "title": "Ububiko"
      },
      "imapDownload": {
        "title": "Gukuramo IMAP",
        "comment": "buri munsi"
      },
      "imapUpload": {
        "title": "Kuramo IMAP",
        "comment": "buri munsi"
      },
      "pop3Download": {
        "title": "POP3 Gukuramo",
        "comment": "buri munsi"
      },
      "received": {
        "title": "Yakiriwe",
        "comment": "ku munota"
      },
      "recipients": {
        "title": "Yoherejwe",
        "comment": "buri munsi"
      },
      "forwards": {
        "title": "Yoherejwe",
        "comment": "buri munsi"
      }
    }
  },
  "filters": {
    "title": "Muyunguruzi",
    "commingSoon": "Kuza vuba"
  }
};

export default locale;