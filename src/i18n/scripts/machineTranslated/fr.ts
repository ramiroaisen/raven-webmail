import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Boîte de réception",
      "sent": "Envoyé",
      "drafts": "Brouillons",
      "trash": "Poubelle",
      "junk": "Spam"
    },
    "delete": "Supprimer le dossier",
    "empty": "Cette boîte aux lettres est vide"
  },
  "message": {
    "labels": {
      "from": "De:",
      "to": "À:",
      "date": "Envoyé:"
    }
  },
  "mailboxMessage": {
    "to": "À:"
  },
  "login": {
    "title": "se connecter",
    "action": "se connecter",
    "labels": {
      "username": "Nom d'utilisateur",
      "password": "Mot de passe"
    }
  },
  "accountButton": {
    "logout": "Déconnexion",
    "myAccount": "Mon compte"
  },
  "compose": {
    "labels": {
      "to": "À:",
      "subject": "Matière:",
      "cc": "Cc:",
      "bcc": "Cci:"
    },
    "tabs": {
      "newMessageTitle": "Nouveau message"
    }
  },
  "editor": {
    "cmd": {
      "undo": "annuler",
      "redo": "Refaire",
      "fontName": "Type de police",
      "fontSize": "Taille de police",
      "bold": "Audacieux",
      "italic": "Italique",
      "underline": "Souligner",
      "justifyLeft": "Alignez à gauche",
      "justifyCenter": "Aligner au milieu",
      "justifyRight": "Aligner à droite",
      "insertUnorderedList": "liste",
      "insertOrderedList": "Liste numérotée",
      "removeFormat": "Supprimer le format"
    },
    "color": {
      "tooltip": "Couleur",
      "foreColor": "Texte",
      "backColor": "Contexte"
    },
    "upload": {
      "tooltip": "Attacher",
      "add": "Ajouter",
      "remove": "Retirer"
    },
    "send": "Envoyer"
  },
  "selection": {
    "title": [
      "{n} messages",
      "{n} message",
      "{n} messages"
    ]
  },
  "actions": {
    "backToMailbox": "Retour à la boîte aux lettres",
    "reload": "Rafraîchir",
    "select": "Sélectionner",
    "markAsUnread": "Marquer comme non lu",
    "markAsRead": "Marquer comme lu",
    "moveTo": "Déménager à",
    "delete": "Supprimer",
    "deletePermanently": "Supprimer définitivement",
    "discardDrafts": "Jeter les brouillons",
    "markAsSpam": "Marquer comme spam",
    "unMarkAsSpam": "Ce n'est pas du spam",
    "forward": "Vers l'avant",
    "reply": "Réponse",
    "attachments": "Pièces jointes"
  },
  "weekDays": {
    "0": "dimanche",
    "1": "Lundi",
    "2": "Mardi",
    "3": "Mercredi",
    "4": "Jeudi",
    "5": "Vendredi",
    "6": "samedi"
  },
  "months": {
    "0": "janvier",
    "1": "février",
    "2": "Mars",
    "3": "avril",
    "4": "Mai",
    "5": "Juin",
    "6": "juillet",
    "7": "août",
    "8": "septembre",
    "9": "octobre",
    "10": "novembre",
    "11": "décembre"
  },
  "notifier": {
    "messageSent": "Message envoyé",
    "mailboxDeleted": "Dossier supprimé"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Nouveau dossier",
      "success": "Dossier créé"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Créer un nouveau dossier",
      "label": "Nom de dossier",
      "accept": "Créer",
      "cancel": "Annuler"
    },
    "deleteMailbox": {
      "title": "Supprimer le dossier \"{mailbox}\"",
      "desc": "Mise en garde. Cette action supprimera définitivement tous les messages du dossier",
      "accept": "Supprimer",
      "cancel": "Annuler"
    }
  },
  "myAccount": {
    "title": "Mon compte",
    "limits": {
      "gbUsed": "{gb} Go",
      "gbTotal": "de {gb} Go",
      "messagesUsed": [
        "{n} messages",
        "{n} message",
        "{n} messages"
      ],
      "messagesTotal": [
        "de {n} messages",
        "du {n} message",
        "de {n} messages"
      ],
      "storage": {
        "title": "Espace de rangement"
      },
      "imapDownload": {
        "title": "Téléchargement IMAP",
        "comment": "du quotidien"
      },
      "imapUpload": {
        "title": "Téléchargement IMAP",
        "comment": "du quotidien"
      },
      "pop3Download": {
        "title": "Téléchargement POP3",
        "comment": "du quotidien"
      },
      "received": {
        "title": "Reçu",
        "comment": "par minute"
      },
      "recipients": {
        "title": "Envoyé",
        "comment": "du quotidien"
      },
      "forwards": {
        "title": "Redirigé",
        "comment": "du quotidien"
      }
    }
  }
};

export default locale;