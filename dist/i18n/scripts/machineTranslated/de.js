"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Posteingang",
            "sent": "Geschickt",
            "drafts": "Entwürfe",
            "trash": "Müll",
            "junk": "Spam"
        },
        "delete": "Lösche Ordner",
        "empty": "Dieses Postfach ist leer"
    },
    "message": {
        "labels": {
            "from": "Von:",
            "to": "Zu:",
            "date": "Geschickt:"
        }
    },
    "mailboxMessage": {
        "to": "Zu:"
    },
    "login": {
        "title": "Anmelden",
        "action": "Anmelden",
        "labels": {
            "username": "Nutzername",
            "password": "Passwort"
        }
    },
    "accountButton": {
        "logout": "Ausloggen",
        "myAccount": "Mein Konto",
        "filters": "Filter"
    },
    "compose": {
        "labels": {
            "to": "Zu:",
            "subject": "Gegenstand:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "Neue Nachricht"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Rückgängig machen",
            "redo": "Wiederholen",
            "fontName": "Schriftart",
            "fontSize": "Schriftgröße",
            "bold": "Fett gedruckt",
            "italic": "Kursiv",
            "underline": "Unterstreichen",
            "justifyLeft": "Linksbündig",
            "justifyCenter": "Mitte ausrichten",
            "justifyRight": "Rechts ausrichten",
            "insertUnorderedList": "Liste",
            "insertOrderedList": "Nummerierte Liste",
            "removeFormat": "Format entfernen"
        },
        "color": {
            "tooltip": "Farbe",
            "foreColor": "Text",
            "backColor": "Hintergrund"
        },
        "upload": {
            "tooltip": "Anfügen",
            "add": "Hinzufügen",
            "remove": "Entfernen"
        },
        "send": "Senden"
    },
    "selection": {
        "title": [
            "{n} Nachrichten",
            "{n} Nachricht",
            "{n} Nachrichten"
        ]
    },
    "actions": {
        "backToMailbox": "Zurück zum Postfach",
        "reload": "Aktualisierung",
        "select": "Wählen",
        "markAsUnread": "Als nicht gelesen markieren",
        "markAsRead": "als gelesen markieren",
        "moveTo": "Ziehen nach",
        "delete": "Löschen",
        "deletePermanently": "Dauerhaft löschen",
        "discardDrafts": "Entwürfe entsorgen",
        "markAsSpam": "als Spam markieren",
        "unMarkAsSpam": "Dies ist kein Spam",
        "forward": "Nach vorne",
        "reply": "Antworten",
        "attachments": "Anhänge"
    },
    "weekDays": {
        "0": "Sonntag",
        "1": "Montag",
        "2": "Dienstag",
        "3": "Mittwoch",
        "4": "Donnerstag",
        "5": "Freitag",
        "6": "Samstag"
    },
    "months": {
        "0": "Januar",
        "1": "Februar",
        "2": "März",
        "3": "April",
        "4": "Kann",
        "5": "Jun",
        "6": "Juli",
        "7": "August",
        "8": "September",
        "9": "Oktober",
        "10": "November",
        "11": "Dezember"
    },
    "notifier": {
        "messageSent": "Nachricht gesendet",
        "mailboxDeleted": "Ordner gelöscht"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Neuer Ordner",
            "success": "Ordner erstellt"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Neuen Ordner erstellen",
            "label": "Ordnernamen",
            "accept": "Erstellen",
            "cancel": "Stornieren"
        },
        "deleteMailbox": {
            "title": "Ordner \"{mailbox}\" löschen",
            "desc": "Vorsicht. Diese Aktion löscht dauerhaft alle Nachrichten im Ordner",
            "accept": "Löschen",
            "cancel": "Stornieren"
        }
    },
    "myAccount": {
        "title": "Mein Konto",
        "commonActions": {
            "title": "Gemeinsame Aktionen",
            "updatePassword": "Passwort erneuern",
            "currentPassword": "Derzeitiges Passwort",
            "newPassword": "Neues Kennwort",
            "confirmPassword": "Bestätige neues Passwort"
        },
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "von {gb} GB",
            "messagesUsed": [
                "{n} Nachrichten",
                "{n} Nachricht",
                "{n} Nachrichten"
            ],
            "messagesTotal": [
                "von {n} Nachrichten",
                "von {n} Nachricht",
                "von {n} Nachrichten"
            ],
            "storage": {
                "title": "Lager"
            },
            "imapDownload": {
                "title": "IMAP-Download",
                "comment": "Täglich"
            },
            "imapUpload": {
                "title": "IMAP-Upload",
                "comment": "Täglich"
            },
            "pop3Download": {
                "title": "POP3 herunterladen",
                "comment": "Täglich"
            },
            "received": {
                "title": "Empfangen",
                "comment": "pro Minute"
            },
            "recipients": {
                "title": "Geschickt",
                "comment": "Täglich"
            },
            "forwards": {
                "title": "Weitergeleitet",
                "comment": "Täglich"
            }
        }
    },
    "filters": {
        "title": "Filter",
        "commingSoon": "Demnächst"
    }
};
exports.default = locale;
