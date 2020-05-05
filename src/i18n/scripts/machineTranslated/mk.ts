import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Инбокс",
      "sent": "Испратено",
      "drafts": "Нацрти",
      "trash": "Ѓубре",
      "junk": "Спам"
    },
    "empty": "Ова поштенско сандаче е празно"
  },
  "message": {
    "labels": {
      "from": "Од:",
      "to": "До:",
      "date": "Испратено:"
    }
  },
  "mailboxMessage": {
    "to": "До:"
  },
  "login": {
    "title": "Најави се",
    "action": "Најави се",
    "labels": {
      "username": "Корисничко име",
      "password": "Лозинка"
    }
  },
  "accountButton": {
    "logout": "Одјави се",
    "myAccount": "Мојот акаунт"
  },
  "compose": {
    "labels": {
      "to": "До:",
      "subject": "Предмет:",
      "cc": "ЦЦ:",
      "bcc": "БЦЦ:"
    },
    "tabs": {
      "newMessageTitle": "Нова порака"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Вратете",
      "redo": "Повторно",
      "fontName": "Тип на фонт",
      "fontSize": "Големина на фонтот",
      "bold": "Задебелен",
      "italic": "Италијански",
      "underline": "Подвлечете",
      "justifyLeft": "Порамнете лево",
      "justifyCenter": "Порамнете ја средината",
      "justifyRight": "Порамнете десно",
      "insertUnorderedList": "Листа",
      "insertOrderedList": "Број на броеви",
      "removeFormat": "Отстрани формат"
    },
    "color": {
      "tooltip": "Боја",
      "foreColor": "Текст",
      "backColor": "Позадина"
    },
    "upload": {
      "tooltip": "Прикачи",
      "add": "Додај",
      "remove": "Отстрани"
    },
    "send": "Испрати"
  },
  "selection": {
    "title": [
      "{n} пораки",
      "{n} порака",
      "{n} пораки"
    ]
  },
  "actions": {
    "backToMailbox": "Назад во поштенско сандаче",
    "reload": "Освежи",
    "select": "Изберете",
    "markAsUnread": "Означи како што не се читаат",
    "markAsRead": "Означи како прочитано",
    "moveTo": "Преминете на",
    "delete": "Избриши",
    "deletePermanently": "Избришете трајно",
    "discardDrafts": "Отфрли нацрти",
    "markAsSpam": "Обележи како спам",
    "unMarkAsSpam": "Ова не е спам",
    "forward": "Напред",
    "reply": "Одговори",
    "attachments": "Прилози"
  },
  "weekDays": {
    "0": "Недела",
    "1": "Понеделник",
    "2": "вторник",
    "3": "Среда",
    "4": "Четврток",
    "5": "Петок",
    "6": "Сабота"
  },
  "months": {
    "0": "Јануари",
    "1": "Февруари",
    "2": "март",
    "3": "Април",
    "4": "Мај",
    "5": "Јуни",
    "6": "Јули",
    "7": "Август",
    "8": "Септември",
    "9": "Октомври",
    "10": "Ноември",
    "11": "Декември"
  },
  "notifier": {
    "messageSent": "Пораката е испратена"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Нова папка",
      "success": "Фолдер е создаден"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Создадете нова папка",
      "label": "Име на папка",
      "accept": "Креирај",
      "cancel": "Откажи"
    }
  },
  "myAccount": {
    "title": "Мојот акаунт",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "од {gb} GB",
      "messagesUsed": [
        "{n} пораки",
        "{n} порака",
        "{n} пораки"
      ],
      "messagesTotal": [
        "од {n} пораки",
        "од {n} порака",
        "од {n} пораки"
      ],
      "storage": {
        "title": "Складирање"
      },
      "imapDownload": {
        "title": "Преземање IMAP",
        "comment": "дневно"
      },
      "imapUpload": {
        "title": "Поставете IMAP",
        "comment": "дневно"
      },
      "pop3Download": {
        "title": "Преземи POP3",
        "comment": "дневно"
      },
      "received": {
        "title": "Прими",
        "comment": "од минута"
      },
      "recipients": {
        "title": "Испратено",
        "comment": "дневно"
      }
    }
  }
};

export default locale;