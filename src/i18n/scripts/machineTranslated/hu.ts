import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Bejövő",
      "sent": "Küldött",
      "drafts": "Dámajáték",
      "trash": "Szemét",
      "junk": "Spam"
    },
    "delete": "Mappa törlése",
    "empty": "Ez a postafiók üres"
  },
  "message": {
    "labels": {
      "from": "Tól től:",
      "to": "Nak nek:",
      "date": "Küldött:"
    }
  },
  "mailboxMessage": {
    "to": "Nak nek:"
  },
  "login": {
    "title": "Bejelentkezés",
    "action": "Bejelentkezés",
    "labels": {
      "username": "Felhasználónév",
      "password": "Jelszó"
    }
  },
  "accountButton": {
    "logout": "Kijelentkezés",
    "myAccount": "Az én fiókom",
    "filters": "Szűrők"
  },
  "compose": {
    "labels": {
      "to": "Nak nek:",
      "subject": "Tantárgy:",
      "cc": "cc:",
      "bcc": "Titkos másolat:"
    },
    "tabs": {
      "newMessageTitle": "Új üzenet"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Undo",
      "redo": "redo",
      "fontName": "Betűtípus",
      "fontSize": "Betűméret",
      "bold": "Bátor",
      "italic": "dőlt betű",
      "underline": "Aláhúzás",
      "justifyLeft": "Balra igazít",
      "justifyCenter": "Igazítsa középen",
      "justifyRight": "Igazítsd jobbra",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Számozott lista",
      "removeFormat": "Távolítsa el a formátumot"
    },
    "color": {
      "tooltip": "Szín",
      "foreColor": "Szöveg",
      "backColor": "Háttér"
    },
    "upload": {
      "tooltip": "Csatolni",
      "add": "hozzáad",
      "remove": "Vegye ki"
    },
    "send": "Küld"
  },
  "selection": {
    "title": [
      "{n} üzenet",
      "{n} üzenet",
      "{n} üzenet"
    ]
  },
  "actions": {
    "backToMailbox": "Vissza a postafiókba",
    "reload": "Frissítés",
    "select": "választ",
    "markAsUnread": "Jelölje meg nem olvasottként",
    "markAsRead": "jelölje meg olvasottként",
    "moveTo": "Költözik",
    "delete": "Töröl",
    "deletePermanently": "Véglegesen törölheti",
    "discardDrafts": "Dobja el a tervezeteket",
    "markAsSpam": "megjelölés spamként",
    "unMarkAsSpam": "Ez nem spam",
    "forward": "Előre",
    "reply": "Válasz",
    "attachments": "Mellékletek"
  },
  "weekDays": {
    "0": "vasárnap",
    "1": "hétfő",
    "2": "kedd",
    "3": "szerda",
    "4": "csütörtök",
    "5": "péntek",
    "6": "szombat"
  },
  "months": {
    "0": "január",
    "1": "február",
    "2": "március",
    "3": "április",
    "4": "Lehet",
    "5": "Június",
    "6": "július",
    "7": "augusztus",
    "8": "szeptember",
    "9": "október",
    "10": "november",
    "11": "december"
  },
  "notifier": {
    "messageSent": "Üzenet elküldve",
    "mailboxDeleted": "A mappa törölve"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Új mappa",
      "success": "A mappa létrehozva"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Hozzon létre új mappát",
      "label": "Mappa neve",
      "accept": "teremt",
      "cancel": "Megszünteti"
    },
    "deleteMailbox": {
      "title": "A (z) \"{mailbox}\" mappa törlése",
      "desc": "Vigyázat. Ez a művelet véglegesen törli a mappában lévő összes üzenetet",
      "accept": "Töröl",
      "cancel": "Megszünteti"
    }
  },
  "myAccount": {
    "title": "Az én fiókom",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "{gb} GB",
      "messagesUsed": [
        "{n} üzenet",
        "{n} üzenet",
        "{n} üzenet"
      ],
      "messagesTotal": [
        "{n} üzenet",
        "{n} üzenet",
        "{n} üzenet"
      ],
      "storage": {
        "title": "Tárolás"
      },
      "imapDownload": {
        "title": "IMAP letöltés",
        "comment": "napi"
      },
      "imapUpload": {
        "title": "IMAP feltöltés",
        "comment": "napi"
      },
      "pop3Download": {
        "title": "POP3 letöltése",
        "comment": "napi"
      },
      "received": {
        "title": "kapott",
        "comment": "percekenként"
      },
      "recipients": {
        "title": "Küldött",
        "comment": "napi"
      },
      "forwards": {
        "title": "átirányított",
        "comment": "napi"
      }
    }
  },
  "filters": {
    "title": "Szűrők",
    "commingSoon": "Hamarosan"
  }
};

export default locale;