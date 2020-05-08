import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Saapuneet",
      "sent": "Lähetetyt",
      "drafts": "luonnokset",
      "trash": "roska",
      "junk": "roskapostin"
    },
    "delete": "Poista kansio",
    "empty": "Tämä postilaatikko on tyhjä"
  },
  "message": {
    "labels": {
      "from": "alkaen:",
      "to": "To:",
      "date": "Lähetetyt:"
    }
  },
  "mailboxMessage": {
    "to": "To:"
  },
  "login": {
    "title": "Kirjaudu sisään",
    "action": "Kirjaudu sisään",
    "labels": {
      "username": "Käyttäjätunnus",
      "password": "Salasana"
    }
  },
  "accountButton": {
    "logout": "Kirjaudu ulos",
    "myAccount": "Tilini"
  },
  "compose": {
    "labels": {
      "to": "To:",
      "subject": "Aihe:",
      "cc": "CC:",
      "bcc": "bcc:"
    },
    "tabs": {
      "newMessageTitle": "Uusi viesti"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Kumoa",
      "redo": "Toista",
      "fontName": "Kirjasintyyppi",
      "fontSize": "Fonttikoko",
      "bold": "Lihavoitu",
      "italic": "kursivoitu",
      "underline": "Korostaa",
      "justifyLeft": "Tasaa vasemmalle",
      "justifyCenter": "Kohdista keskimmäinen",
      "justifyRight": "Kohdista oikea",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Numeroitu luettelo",
      "removeFormat": "Poista muoto"
    },
    "color": {
      "tooltip": "Väri",
      "foreColor": "Teksti",
      "backColor": "Tausta"
    },
    "upload": {
      "tooltip": "Liittää",
      "add": "Lisätä",
      "remove": "Poista"
    },
    "send": "Lähettää"
  },
  "selection": {
    "title": [
      "{n} viestiä",
      "{n} viesti",
      "{n} viestiä"
    ]
  },
  "actions": {
    "backToMailbox": "Takaisin postilaatikkoon",
    "reload": "virkistää",
    "select": "valita",
    "markAsUnread": "Merkitse lukematta",
    "markAsRead": "Merkitse luetuksi",
    "moveTo": "Muuttaa",
    "delete": "Poistaa",
    "deletePermanently": "Poista lopullisesti",
    "discardDrafts": "Hylkää luonnokset",
    "markAsSpam": "merkitse roskapostiksi",
    "unMarkAsSpam": "Tämä ei ole roskapostia",
    "forward": "Eteenpäin",
    "reply": "Vastaa",
    "attachments": "Liitteet"
  },
  "weekDays": {
    "0": "sunnuntai",
    "1": "maanantai",
    "2": "tiistai",
    "3": "keskiviikko",
    "4": "torstai",
    "5": "perjantai",
    "6": "lauantai"
  },
  "months": {
    "0": "tammikuu",
    "1": "helmikuu",
    "2": "maaliskuu",
    "3": "huhtikuu",
    "4": "saattaa",
    "5": "kesäkuu",
    "6": "heinäkuu",
    "7": "elokuu",
    "8": "syyskuu",
    "9": "lokakuu",
    "10": "marraskuu",
    "11": "joulukuu"
  },
  "notifier": {
    "messageSent": "Viesti lähetetty",
    "mailboxDeleted": "Kansio poistettu"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Uusi kansio",
      "success": "Kansio luotu"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Luo uusi kansio",
      "label": "Kansion nimi",
      "accept": "Luoda",
      "cancel": "Peruuttaa"
    },
    "deleteMailbox": {
      "title": "Poista kansio \"{mailbox}\"",
      "desc": "Varoitus. Tämä toimenpide poistaa pysyvästi kaikki kansion viestit",
      "accept": "Poistaa",
      "cancel": "Peruuttaa"
    }
  },
  "myAccount": {
    "title": "Tilini",
    "limits": {
      "gbUsed": "{gb} Gt",
      "gbTotal": "/ {gb} Gt",
      "messagesUsed": [
        "{n} viestiä",
        "{n} viesti",
        "{n} viestiä"
      ],
      "messagesTotal": [
        "{n} viestistä",
        "{n} viestistä",
        "{n} viestistä"
      ],
      "storage": {
        "title": "varastointi"
      },
      "imapDownload": {
        "title": "IMAP Lataa",
        "comment": "päivittäin"
      },
      "imapUpload": {
        "title": "IMAP-lähetys",
        "comment": "päivittäin"
      },
      "pop3Download": {
        "title": "Lataa POP3",
        "comment": "päivittäin"
      },
      "received": {
        "title": "Otettu vastaan",
        "comment": "minuutilla"
      },
      "recipients": {
        "title": "Lähetetyt",
        "comment": "päivittäin"
      },
      "forwards": {
        "title": "Uudelleenohjattu",
        "comment": "päivittäin"
      }
    }
  }
};

export default locale;