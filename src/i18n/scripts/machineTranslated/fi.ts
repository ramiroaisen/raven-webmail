import {Locale} from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Saapuneet",
      "sent": "Lähetetyt",
      "drafts": "luonnokset",
      "trash": "roska",
      "junk": "roskapostin"
    },
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
    "logout": "Kirjaudu ulos"
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
    "reload": "Lataa",
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
  }
};

export default locale;