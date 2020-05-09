import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Inbox",
      "sent": "Sent",
      "drafts": "drafts",
      "trash": "Trash",
      "junk": "Spam"
    },
    "delete": "Famafa ny fampirimana",
    "empty": "Tsy misy na inona na inona ity boaty mailaka ity"
  },
  "message": {
    "labels": {
      "from": "From:",
      "to": "To:",
      "date": "Sent:"
    }
  },
  "mailboxMessage": {
    "to": "To:"
  },
  "login": {
    "title": "Hiditra",
    "action": "Hiditra",
    "labels": {
      "username": "Anaran'ny mpampiasa",
      "password": "Password"
    }
  },
  "accountButton": {
    "logout": "hivoaka",
    "myAccount": "Ny kaontiko",
    "filters": "sivana"
  },
  "compose": {
    "labels": {
      "to": "To:",
      "subject": "Subject:",
      "cc": "Cc:",
      "bcc": "MM:"
    },
    "tabs": {
      "newMessageTitle": "Hafatra vaovao"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Ravao",
      "redo": "averina atao",
      "fontName": "Karazana endritsoratra",
      "fontSize": "Habe feno",
      "bold": "Bold",
      "italic": "Italic",
      "underline": "Mitsipika",
      "justifyLeft": "Ataovy ankavia",
      "justifyCenter": "Afovoany afovoany",
      "justifyRight": "Ataovy tsara",
      "insertUnorderedList": "List",
      "insertOrderedList": "Lisitra resahina",
      "removeFormat": "Esory ny endrika"
    },
    "color": {
      "tooltip": "Color",
      "foreColor": "Text",
      "backColor": "lafika"
    },
    "upload": {
      "tooltip": "mampiditra",
      "add": "Add",
      "remove": "Remove"
    },
    "send": "Send"
  },
  "selection": {
    "title": [
      "{n} hafatra",
      "Hafatra 1",
      "{n} hafatra"
    ]
  },
  "actions": {
    "backToMailbox": "Miverina amin'ny boaty mailaka",
    "reload": "Refresh",
    "select": "Select",
    "markAsUnread": "Mariho fa tsy novakiana",
    "markAsRead": "Mariho raha vakiana",
    "moveTo": "Mifindra",
    "delete": "Mamafa",
    "deletePermanently": "Hamafa mandrakizay",
    "discardDrafts": "Manaova soritra",
    "markAsSpam": "Mariho ho toy ny spam",
    "unMarkAsSpam": "Tsy spam io",
    "forward": "Forward",
    "reply": "navalin'i",
    "attachments": "kofehy mifamatotra"
  },
  "weekDays": {
    "0": "Alahady",
    "1": "Alatsinainy",
    "2": "Talata",
    "3": "Alarobia",
    "4": "Alakamisy",
    "5": "Zoma",
    "6": "Asabotsy"
  },
  "months": {
    "0": "Janoary",
    "1": "Febroary",
    "2": "March",
    "3": "Aprily",
    "4": "Mey",
    "5": "Jun",
    "6": "Jolay",
    "7": "Aogositra",
    "8": "Septambra",
    "9": "Oktobra",
    "10": "Novambra",
    "11": "Desambra"
  },
  "notifier": {
    "messageSent": "Hafatra nandefa",
    "mailboxDeleted": "Voafafa ny folder"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Fandraisana vaovao",
      "success": "Famoronana noforonina"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Mamorona fampirimana vaovao",
      "label": "Anaran'ny folder",
      "accept": "mamorona",
      "cancel": "hanafoana"
    },
    "deleteMailbox": {
      "title": "Famafa ny \"folder\" {mailbox} \"",
      "desc": "Mitandrina. Ity hetsika ity dia hamafa ireo hafatra rehetra ao anaty fampirimana",
      "accept": "Mamafa",
      "cancel": "hanafoana"
    }
  },
  "myAccount": {
    "title": "Ny kaontiko",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "amin'ny {gb} GB",
      "messagesUsed": [
        "{n} hafatra",
        "Hafatra 1",
        "{n} hafatra"
      ],
      "messagesTotal": [
        "amin'ny {n} hafatra",
        "hafatra {n}",
        "amin'ny {n} hafatra"
      ],
      "storage": {
        "title": "Storage"
      },
      "imapDownload": {
        "title": "IMAP Download",
        "comment": "isan'andro"
      },
      "imapUpload": {
        "title": "IMAP Upload",
        "comment": "isan'andro"
      },
      "pop3Download": {
        "title": "POP3 Download",
        "comment": "isan'andro"
      },
      "received": {
        "title": "Received",
        "comment": "amin'ny minitra"
      },
      "recipients": {
        "title": "Sent",
        "comment": "isan'andro"
      },
      "forwards": {
        "title": "Navily",
        "comment": "isan'andro"
      }
    }
  },
  "filters": {
    "title": "sivana",
    "commingSoon": "Ho avy tsy ho ela"
  }
};

export default locale;