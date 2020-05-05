import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inkorg",
      "sent": "sände",
      "drafts": "utkast",
      "trash": "Skräp",
      "junk": "spam"
    },
    "empty": "Den här brevlådan är tom"
  },
  "message": {
    "labels": {
      "from": "Från:",
      "to": "Till:",
      "date": "Skickat:"
    }
  },
  "mailboxMessage": {
    "to": "Till:"
  },
  "login": {
    "title": "Logga in",
    "action": "Logga in",
    "labels": {
      "username": "Användarnamn",
      "password": "Lösenord"
    }
  },
  "accountButton": {
    "logout": "Logga ut",
    "myAccount": "Mitt konto"
  },
  "compose": {
    "labels": {
      "to": "Till:",
      "subject": "Ämne:",
      "cc": "cc:",
      "bcc": "Hemlig kopia:"
    },
    "tabs": {
      "newMessageTitle": "Nytt meddelande"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Ångra",
      "redo": "Göra om",
      "fontName": "Typsnitt",
      "fontSize": "Textstorlek",
      "bold": "Djärv",
      "italic": "Kursiv",
      "underline": "Understrykning",
      "justifyLeft": "Justera vänster",
      "justifyCenter": "Justera mitten",
      "justifyRight": "Anpassa till höger",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Numrerad lista",
      "removeFormat": "Ta bort format"
    },
    "color": {
      "tooltip": "Färg",
      "foreColor": "Text",
      "backColor": "Bakgrund"
    },
    "upload": {
      "tooltip": "Fästa",
      "add": "Lägg till",
      "remove": "Avlägsna"
    },
    "send": "Skicka"
  },
  "selection": {
    "title": [
      "{n} meddelanden",
      "{n} meddelande",
      "{n} meddelanden"
    ]
  },
  "actions": {
    "backToMailbox": "Tillbaka till brevlådan",
    "reload": "Uppdatera",
    "select": "Välj",
    "markAsUnread": "Markera som inte läst",
    "markAsRead": "markera som läst",
    "moveTo": "Flytta till",
    "delete": "Radera",
    "deletePermanently": "Ta bort permanent",
    "discardDrafts": "Kasta utkast",
    "markAsSpam": "markera som skräppost",
    "unMarkAsSpam": "Detta är inte skräppost",
    "forward": "Framåt",
    "reply": "Svar",
    "attachments": "bilagor"
  },
  "weekDays": {
    "0": "söndag",
    "1": "måndag",
    "2": "tisdag",
    "3": "onsdag",
    "4": "torsdag",
    "5": "fredag",
    "6": "lördag"
  },
  "months": {
    "0": "januari",
    "1": "februari",
    "2": "Mars",
    "3": "april",
    "4": "Maj",
    "5": "juni",
    "6": "juli",
    "7": "augusti",
    "8": "september",
    "9": "oktober",
    "10": "november",
    "11": "december"
  },
  "notifier": {
    "messageSent": "Meddelande skickat"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Ny mapp",
      "success": "Mapp skapad"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Skapa ny mapp",
      "label": "Mapp namn",
      "accept": "Skapa",
      "cancel": "Avbryt"
    }
  },
  "myAccount": {
    "title": "Mitt konto",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "av {gb} GB",
      "messagesUsed": [
        "{n} meddelanden",
        "{n} meddelande",
        "{n} meddelanden"
      ],
      "messagesTotal": [
        "av {n} meddelanden",
        "av {n} meddelandet",
        "av {n} meddelanden"
      ],
      "storage": {
        "title": "Lagring"
      },
      "imapDownload": {
        "title": "IMAP-nedladdning",
        "comment": "dagligen"
      },
      "imapUpload": {
        "title": "IMAP Upload",
        "comment": "dagligen"
      },
      "pop3Download": {
        "title": "POP3 nedladdning",
        "comment": "dagligen"
      },
      "received": {
        "title": "Mottagen",
        "comment": "efter minut"
      },
      "recipients": {
        "title": "sände",
        "comment": "dagligen"
      }
    }
  }
};

export default locale;