import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Вхідні",
      "sent": "Надісланий",
      "drafts": "Чернетки",
      "trash": "Сміття",
      "junk": "Спам"
    },
    "delete": "Видалити папку",
    "empty": "Ця поштова скринька порожня"
  },
  "message": {
    "labels": {
      "from": "Від:",
      "to": "До:",
      "date": "Надісланий:"
    }
  },
  "mailboxMessage": {
    "to": "До:"
  },
  "login": {
    "title": "Увійти",
    "action": "Увійти",
    "labels": {
      "username": "Ім'я користувача",
      "password": "Пароль"
    }
  },
  "accountButton": {
    "logout": "Вийти з аккаунта",
    "myAccount": "Мій рахунок",
    "filters": "Фільтри"
  },
  "compose": {
    "labels": {
      "to": "До:",
      "subject": "Тема:",
      "cc": "Копія:",
      "bcc": "Код:"
    },
    "tabs": {
      "newMessageTitle": "Нове повідомлення"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Скасувати",
      "redo": "Повторити",
      "fontName": "Тип шрифту",
      "fontSize": "Розмір шрифту",
      "bold": "Сміливий",
      "italic": "Курсив",
      "underline": "Підкресли",
      "justifyLeft": "Вирівняйте ліворуч",
      "justifyCenter": "Вирівняти середину",
      "justifyRight": "Вирівняти правильно",
      "insertUnorderedList": "Список",
      "insertOrderedList": "Пронумерований список",
      "removeFormat": "Видалити формат"
    },
    "color": {
      "tooltip": "Колір",
      "foreColor": "Текст",
      "backColor": "Фон"
    },
    "upload": {
      "tooltip": "Прикріпити",
      "add": "Додайте",
      "remove": "Видалити"
    },
    "send": "Надіслати"
  },
  "selection": {
    "title": [
      "{n} повідомлення",
      "{n} повідомлення",
      "{n} повідомлення"
    ]
  },
  "actions": {
    "backToMailbox": "Повернутися до поштової скриньки",
    "reload": "Оновити",
    "select": "Виберіть",
    "markAsUnread": "Позначити як не прочитане",
    "markAsRead": "Відзначити як прочитане",
    "moveTo": "Рухатися",
    "delete": "Видалити",
    "deletePermanently": "Видалити назавжди",
    "discardDrafts": "Відкиньте протяги",
    "markAsSpam": "Позначити як спам",
    "unMarkAsSpam": "Це не спам",
    "forward": "Вперед",
    "reply": "Відповісти",
    "attachments": "Вкладення"
  },
  "weekDays": {
    "0": "Неділя",
    "1": "Понеділок",
    "2": "Вівторок",
    "3": "Середа",
    "4": "Четвер",
    "5": "П’ятниця",
    "6": "Субота"
  },
  "months": {
    "0": "Січень",
    "1": "Лютий",
    "2": "Березень",
    "3": "Квітень",
    "4": "Може",
    "5": "Червень",
    "6": "Липень",
    "7": "Серпень",
    "8": "Вересень",
    "9": "Жовтень",
    "10": "Листопад",
    "11": "Грудень"
  },
  "notifier": {
    "messageSent": "Повідомлення надіслано",
    "mailboxDeleted": "Папка видалена"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Нова папка",
      "success": "Папка створена"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Створіть нову папку",
      "label": "Назва папки",
      "accept": "Створіть",
      "cancel": "Скасувати"
    },
    "deleteMailbox": {
      "title": "Видалити папку \"{mailbox}\"",
      "desc": "Обережність. Ця дія назавжди видалить усі повідомлення в папці",
      "accept": "Видалити",
      "cancel": "Скасувати"
    }
  },
  "myAccount": {
    "title": "Мій рахунок",
    "commonActions": {
      "title": "Поширені дії",
      "updatePassword": "Оновити пароль",
      "currentPassword": "Поточний пароль",
      "newPassword": "Новий пароль",
      "confirmPassword": "Підтвердити новий пароль"
    },
    "limits": {
      "gbUsed": "{gb} Гб",
      "gbTotal": "від {gb} Гб",
      "messagesUsed": [
        "{n} повідомлення",
        "{n} повідомлення",
        "{n} повідомлення"
      ],
      "messagesTotal": [
        "з {n} повідомлень",
        "повідомлення {n}",
        "з {n} повідомлень"
      ],
      "storage": {
        "title": "Зберігання"
      },
      "imapDownload": {
        "title": "Завантажити IMAP",
        "comment": "щодня"
      },
      "imapUpload": {
        "title": "Завантаження IMAP",
        "comment": "щодня"
      },
      "pop3Download": {
        "title": "Завантажити POP3",
        "comment": "щодня"
      },
      "received": {
        "title": "Отримано",
        "comment": "за хвилиною"
      },
      "recipients": {
        "title": "Надісланий",
        "comment": "щодня"
      },
      "forwards": {
        "title": "Перенаправлено",
        "comment": "щодня"
      }
    }
  },
  "filters": {
    "title": "Фільтри",
    "commingSoon": "Незабаром"
  }
};

export default locale;