import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Ներարկղ",
      "sent": "Ուղարկվել է",
      "drafts": "Նախագծեր",
      "trash": "Աղբարկղ",
      "junk": "Սպամ"
    },
    "delete": "Deleteնջել թղթապանակը",
    "empty": "Այս փոստարկղը դատարկ է"
  },
  "message": {
    "labels": {
      "from": "From:",
      "to": "Դեպի",
      "date": "Ուղարկվել է."
    }
  },
  "mailboxMessage": {
    "to": "Դեպի"
  },
  "login": {
    "title": "Մուտք գործել",
    "action": "Մուտք գործել",
    "labels": {
      "username": "Օգտագործողի անունը",
      "password": "Գաղտնաբառ"
    }
  },
  "accountButton": {
    "logout": "Դուրս գալ",
    "myAccount": "Իմ հաշիվը",
    "filters": "Զտիչներ"
  },
  "compose": {
    "labels": {
      "to": "Դեպի",
      "subject": "Առարկա:",
      "cc": "ԳՀ:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Նոր հաղորդագրություն"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Վերացնել",
      "redo": "Կրկնել",
      "fontName": "Տառատեսակի տեսակը",
      "fontSize": "Տառատեսակի չափը",
      "bold": "Համարձակ",
      "italic": "Իտալական",
      "underline": "Ընդգծիր",
      "justifyLeft": "Հավասարեցնել ձախ",
      "justifyCenter": "Հավասարեցնել միջինը",
      "justifyRight": "Հավասարեցնել աջը",
      "insertUnorderedList": "Ցուցակ",
      "insertOrderedList": "Թվարկված ցուցակը",
      "removeFormat": "Հեռացրեք ձևաչափը"
    },
    "color": {
      "tooltip": "Գույն",
      "foreColor": "Տեքստ",
      "backColor": "Նախապատմություն"
    },
    "upload": {
      "tooltip": "Կցել",
      "add": "Ավելացնել",
      "remove": "Հեռացրեք"
    },
    "send": "Ուղարկել"
  },
  "selection": {
    "title": [
      "{n} հաղորդագրություններ",
      "{n} հաղորդագրություն",
      "{n} հաղորդագրություններ"
    ]
  },
  "actions": {
    "backToMailbox": "Վերադառնալ փոստարկղին",
    "reload": "Թարմացրեք",
    "select": "Ընտրեք",
    "markAsUnread": "Նշեք որպես չկարդացված",
    "markAsRead": "Նշեք որպես կարդալ",
    "moveTo": "Տեղափոխվել",
    "delete": "Նջել",
    "deletePermanently": "Մշտապես ջնջել",
    "discardDrafts": "Վերացնել նախագծերը",
    "markAsSpam": "Նշել որպես սպամ",
    "unMarkAsSpam": "Սա սպամ չէ",
    "forward": "Փոխանցել",
    "reply": "Պատասխանել",
    "attachments": "Կցորդներ"
  },
  "weekDays": {
    "0": "Կիրակի",
    "1": "Երկուշաբթի",
    "2": "Երեքշաբթի",
    "3": "Չորեքշաբթի",
    "4": "Հինգշաբթի",
    "5": "Ուրբաթ",
    "6": "Շաբաթ օրը"
  },
  "months": {
    "0": "Հունվար",
    "1": "Փետրվար",
    "2": "Մարտ",
    "3": "Ապրիլ",
    "4": "Մայիս",
    "5": "Հունիս",
    "6": "Հուլիս",
    "7": "Օգոստոս",
    "8": "Սեպտեմբեր",
    "9": "Հոկտեմբեր",
    "10": "Նոյեմբեր",
    "11": "Դեկտեմբեր"
  },
  "notifier": {
    "messageSent": "Նամակը ուղարկված է",
    "mailboxDeleted": "Թղթապանակը ջնջվել է"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Նոր թղթապանակ",
      "success": "Թղթապանակը ստեղծվել է"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Ստեղծեք նոր թղթապանակ",
      "label": "Թղթապանակի անունը",
      "accept": "Ստեղծել",
      "cancel": "Չեղարկել"
    },
    "deleteMailbox": {
      "title": "Deleteնջել թղթապանակը «{mailbox}»",
      "desc": "Զգուշություն. Այս գործողությունը մշտապես կջնջի թղթապանակում բոլոր հաղորդագրությունները",
      "accept": "Նջել",
      "cancel": "Չեղարկել"
    }
  },
  "myAccount": {
    "title": "Իմ հաշիվը",
    "limits": {
      "gbUsed": "1} ԳԲ",
      "gbTotal": "{gb} ԳԲ-ից",
      "messagesUsed": [
        "{n} հաղորդագրություններ",
        "{n} հաղորդագրություն",
        "{n} հաղորդագրություններ"
      ],
      "messagesTotal": [
        "{n} հաղորդագրությունից",
        "{n} հաղորդագրությունից",
        "{n} հաղորդագրությունից"
      ],
      "storage": {
        "title": "Պահեստավորում"
      },
      "imapDownload": {
        "title": "IMAP ներբեռնումը",
        "comment": "ամեն օր"
      },
      "imapUpload": {
        "title": "IMAP- ի վերբեռնումը",
        "comment": "ամեն օր"
      },
      "pop3Download": {
        "title": "POP3 ներբեռնումը",
        "comment": "ամեն օր"
      },
      "received": {
        "title": "Ստացվեց",
        "comment": "րոպեով"
      },
      "recipients": {
        "title": "Ուղարկվել է",
        "comment": "ամեն օր"
      },
      "forwards": {
        "title": "Վերահղված",
        "comment": "ամեն օր"
      }
    }
  },
  "filters": {
    "title": "Զտիչներ",
    "commingSoon": "Շուտով"
  }
};

export default locale;