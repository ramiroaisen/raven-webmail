import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Posta in arrivo",
      "sent": "Inviato",
      "drafts": "bozze",
      "trash": "Spazzatura",
      "junk": "Spam"
    },
    "empty": "Questa cassetta postale è vuota"
  },
  "message": {
    "labels": {
      "from": "A partire dal:",
      "to": "Per:",
      "date": "Inviato:"
    }
  },
  "mailboxMessage": {
    "to": "Per:"
  },
  "login": {
    "title": "registrati",
    "action": "registrati",
    "labels": {
      "username": "Nome utente",
      "password": "Parola d'ordine"
    }
  },
  "accountButton": {
    "logout": "disconnessione",
    "myAccount": "Il mio account"
  },
  "compose": {
    "labels": {
      "to": "Per:",
      "subject": "Soggetto:",
      "cc": "cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Nuovo messaggio"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Disfare",
      "redo": "Rifare",
      "fontName": "Tipo di carattere",
      "fontSize": "Dimensione del font",
      "bold": "Grassetto",
      "italic": "Corsivo",
      "underline": "Sottolineare",
      "justifyLeft": "Allineare a sinistra",
      "justifyCenter": "Allinea al centro",
      "justifyRight": "Allinea a destra",
      "insertUnorderedList": "Elenco",
      "insertOrderedList": "Elenco numerato",
      "removeFormat": "Rimuovi formato"
    },
    "color": {
      "tooltip": "Colore",
      "foreColor": "Testo",
      "backColor": "sfondo"
    },
    "upload": {
      "tooltip": "allegare",
      "add": "Inserisci",
      "remove": "Rimuovere"
    },
    "send": "Spedire"
  },
  "selection": {
    "title": [
      "{n} messaggi",
      "{n} messaggio",
      "{n} messaggi"
    ]
  },
  "actions": {
    "backToMailbox": "Torna alla casella di posta",
    "reload": "ricaricare",
    "select": "Selezionare",
    "markAsUnread": "Segna come non letto",
    "markAsRead": "segna come letto",
    "moveTo": "Sposta in",
    "delete": "Elimina",
    "deletePermanently": "Elimina definitivamente",
    "discardDrafts": "Elimina le bozze",
    "markAsSpam": "segna come spam",
    "unMarkAsSpam": "Questo non è spam",
    "forward": "Inoltrare",
    "reply": "rispondere",
    "attachments": "allegati"
  },
  "weekDays": {
    "0": "Domenica",
    "1": "Lunedi",
    "2": "martedì",
    "3": "mercoledì",
    "4": "giovedi",
    "5": "Venerdì",
    "6": "Sabato"
  },
  "months": {
    "0": "gennaio",
    "1": "febbraio",
    "2": "marzo",
    "3": "aprile",
    "4": "Maggio",
    "5": "giugno",
    "6": "luglio",
    "7": "agosto",
    "8": "settembre",
    "9": "ottobre",
    "10": "novembre",
    "11": "dicembre"
  },
  "notifier": {
    "messageSent": "Messaggio inviato"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nuova cartella",
      "success": "Cartella creata"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Crea una nuova cartella",
      "label": "Nome della cartella",
      "accept": "Creare",
      "cancel": "Annulla"
    }
  },
  "myAccount": {
    "title": "Il mio account",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "di {gb} GB",
      "storage": {
        "title": "Conservazione"
      },
      "imapDownload": {
        "title": "Download IMAP"
      },
      "imapUpload": {
        "title": "Caricamento IMAP"
      },
      "pop3Download": {
        "title": "Download POP3"
      }
    }
  }
};

export default locale;