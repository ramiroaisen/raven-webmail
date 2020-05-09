import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "W pudełku",
      "sent": "Wysłano",
      "drafts": "Warcaby",
      "trash": "Śmieci",
      "junk": "spam"
    },
    "delete": "Usunięty folder",
    "empty": "Ta skrzynka pocztowa jest pusta"
  },
  "message": {
    "labels": {
      "from": "Od:",
      "to": "Do:",
      "date": "Wysłano:"
    }
  },
  "mailboxMessage": {
    "to": "Do:"
  },
  "login": {
    "title": "Zaloguj się",
    "action": "Zaloguj się",
    "labels": {
      "username": "Nazwa Użytkownika",
      "password": "Hasło"
    }
  },
  "accountButton": {
    "logout": "Wyloguj się",
    "myAccount": "Moje konto",
    "filters": "Filtry"
  },
  "compose": {
    "labels": {
      "to": "Do:",
      "subject": "Przedmiot:",
      "cc": "DW:",
      "bcc": "UDW:"
    },
    "tabs": {
      "newMessageTitle": "Nowa wiadomość"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Cofnij",
      "redo": "Przerobić",
      "fontName": "Typ czcionki",
      "fontSize": "Rozmiar czcionki",
      "bold": "Pogrubienie",
      "italic": "italski",
      "underline": "Podkreślać",
      "justifyLeft": "Wyrównaj do lewej",
      "justifyCenter": "Wyrównaj do środka",
      "justifyRight": "Wyrównaj do prawej",
      "insertUnorderedList": "Lista",
      "insertOrderedList": "Lista numerowana",
      "removeFormat": "Usuń format"
    },
    "color": {
      "tooltip": "Kolor",
      "foreColor": "Tekst",
      "backColor": "tło"
    },
    "upload": {
      "tooltip": "Dołączać",
      "add": "Dodaj",
      "remove": "Usunąć"
    },
    "send": "Wysłać"
  },
  "selection": {
    "title": [
      "{n} wiadomości",
      "Wiadomość {n}",
      "{n} wiadomości"
    ]
  },
  "actions": {
    "backToMailbox": "Powrót do skrzynki pocztowej",
    "reload": "Odświeżać",
    "select": "Wybierz",
    "markAsUnread": "Oznacz jako nie przeczytane",
    "markAsRead": "Oznacz jako przeczytane",
    "moveTo": "Przenieś do",
    "delete": "Usunąć",
    "deletePermanently": "Usuń trwale",
    "discardDrafts": "Odrzuć wersje robocze",
    "markAsSpam": "Oznacz jako spam",
    "unMarkAsSpam": "To nie jest spam",
    "forward": "Naprzód",
    "reply": "Odpowiadać",
    "attachments": "Załączniki"
  },
  "weekDays": {
    "0": "niedziela",
    "1": "poniedziałek",
    "2": "wtorek",
    "3": "środa",
    "4": "czwartek",
    "5": "piątek",
    "6": "sobota"
  },
  "months": {
    "0": "styczeń",
    "1": "luty",
    "2": "Marsz",
    "3": "kwiecień",
    "4": "Może",
    "5": "Jun",
    "6": "lipiec",
    "7": "sierpień",
    "8": "wrzesień",
    "9": "październik",
    "10": "listopad",
    "11": "grudzień"
  },
  "notifier": {
    "messageSent": "Wiadomość wysłana",
    "mailboxDeleted": "Folder usunięty"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nowy folder",
      "success": "Utworzono folder"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Stwórz nowy folder",
      "label": "Nazwa folderu",
      "accept": "Stwórz",
      "cancel": "Anuluj"
    },
    "deleteMailbox": {
      "title": "Usuń folder „{mailbox}”",
      "desc": "Uwaga. Ta czynność spowoduje trwałe usunięcie wszystkich wiadomości w folderze",
      "accept": "Usunąć",
      "cancel": "Anuluj"
    }
  },
  "myAccount": {
    "title": "Moje konto",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "z {gb} GB",
      "messagesUsed": [
        "{n} wiadomości",
        "Wiadomość {n}",
        "{n} wiadomości"
      ],
      "messagesTotal": [
        "z {n} wiadomości",
        "wiadomości {n}",
        "z {n} wiadomości"
      ],
      "storage": {
        "title": "Przechowywanie"
      },
      "imapDownload": {
        "title": "Pobieranie IMAP",
        "comment": "codziennie"
      },
      "imapUpload": {
        "title": "Przesyłanie IMAP",
        "comment": "codziennie"
      },
      "pop3Download": {
        "title": "Pobieranie POP3",
        "comment": "codziennie"
      },
      "received": {
        "title": "Odebrane",
        "comment": "za minutę"
      },
      "recipients": {
        "title": "Wysłano",
        "comment": "codziennie"
      },
      "forwards": {
        "title": "Przekierowano",
        "comment": "codziennie"
      }
    }
  },
  "filters": {
    "title": "Filtry",
    "commingSoon": "Wkrótce"
  }
};

export default locale;