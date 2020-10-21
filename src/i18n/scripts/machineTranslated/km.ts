import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "ប្រអប់ទទួល",
      "sent": "បានផ្ញើ",
      "drafts": "សេចក្តីព្រាង",
      "trash": "សំរាម",
      "junk": "សារ​ឥត​បាន​ការ"
    },
    "delete": "លុបថតឯកសារ",
    "empty": "ប្រអប់សំបុត្រនេះទទេ"
  },
  "message": {
    "labels": {
      "from": "ពី៖",
      "to": "ជូនចំពោះ៖",
      "date": "បានផ្ញើ៖"
    }
  },
  "mailboxMessage": {
    "to": "ជូនចំពោះ៖"
  },
  "login": {
    "title": "ចូល",
    "action": "ចូល",
    "labels": {
      "username": "ឈ្មោះ​អ្នកប្រើប្រាស់",
      "password": "ពាក្យសម្ងាត់"
    }
  },
  "accountButton": {
    "logout": "ចាកចេញ",
    "myAccount": "គណនី​របស់ខ្ញុំ",
    "filters": "តម្រង"
  },
  "compose": {
    "labels": {
      "to": "ជូនចំពោះ៖",
      "subject": "ប្រធានបទ៖",
      "cc": "ចម្លងជូន៖",
      "bcc": "ចម្លងជាសម្ងាត់ជូន៖"
    },
    "tabs": {
      "newMessageTitle": "សារថ្មី"
    }
  },
  "editor": {
    "cmd": {
      "undo": "មិនធ្វើវិញ",
      "redo": "ធ្វើវិញ",
      "fontName": "ប្រភេទពុម្ពអក្សរ",
      "fontSize": "ទំហំ​អក្សរ",
      "bold": "ដិត",
      "italic": "ទ្រេត",
      "underline": "គូសបញ្ជាក់",
      "justifyLeft": "តម្រឹមឆ្វេង",
      "justifyCenter": "តម្រឹមកណ្តាល",
      "justifyRight": "តម្រឹមស្តាំ",
      "insertUnorderedList": "បញ្ជី",
      "insertOrderedList": "បញ្ជីលេខ",
      "removeFormat": "យកទ្រង់ទ្រាយចេញ"
    },
    "color": {
      "tooltip": "ពណ៌",
      "foreColor": "អត្ថបទ",
      "backColor": "សាវតា"
    },
    "upload": {
      "tooltip": "ភ្ជាប់",
      "add": "បន្ថែម",
      "remove": "យកចេញ"
    },
    "send": "ផ្ញើ"
  },
  "selection": {
    "title": [
      "{undefined} សារ",
      "{undefined} សារ",
      "{undefined} សារ"
    ]
  },
  "actions": {
    "backToMailbox": "ត្រលប់ទៅប្រអប់សំបុត្រ",
    "reload": "ធ្វើ​ឱ្យ​ស្រស់",
    "select": "ជ្រើសរើស",
    "markAsUnread": "សម្គាល់ថាមិនបានអាន",
    "markAsRead": "សម្គាល់ថាអានរួច",
    "moveTo": "ផ្លាស់ទី​ទៅ",
    "delete": "លុប",
    "deletePermanently": "លុបជាអចិន្ត្រៃយ៍",
    "discardDrafts": "បោះបង់សេចក្តីព្រាង",
    "markAsSpam": "សម្គាល់ថាជាសារឥតបានការ",
    "unMarkAsSpam": "នេះមិនមែនជាសារឥតបានការទេ",
    "forward": "បញ្ជូនបន្ត",
    "reply": "ឆ្លើយតប",
    "attachments": "ឯកសារភ្ជាប់"
  },
  "weekDays": {
    "0": "ថ្ងៃអាទិត្យ",
    "1": "ថ្ងៃច័ន្ទ",
    "2": "ថ្ងៃអង្គារ",
    "3": "ថ្ងៃពុធ",
    "4": "ថ្ងៃព្រហស្បតិ៍",
    "5": "ថ្ងៃសុក្រ",
    "6": "ថ្ងៃសៅរ៍"
  },
  "months": {
    "0": "មករា",
    "1": "ខែកុម្ភៈ",
    "2": "មីនា",
    "3": "ខែមេសា",
    "4": "ឧសភា",
    "5": "មិថុនា",
    "6": "ខែកក្កដា",
    "7": "សីហា",
    "8": "ខែកញ្ញា",
    "9": "តុលា",
    "10": "វិច្ឆិកា",
    "11": "ធ្នូ"
  },
  "notifier": {
    "messageSent": "បានផ្ញើសារ",
    "mailboxDeleted": "បានលុបថតឯកសារ"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "ប្រអប់​ឯកសារ​ថ្មី",
      "success": "បានបង្កើតថត"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "បង្កើតថតឯកសារថ្មី",
      "label": "ឈ្មោះថតឯកសារ",
      "accept": "បង្កើត",
      "cancel": "បោះបង់"
    },
    "deleteMailbox": {
      "title": "លុបថតឯកសារ \"{mailbox}\"",
      "desc": "ការប្រុងប្រយ័ត្ន។ សកម្មភាពនេះនឹងលុបសារទាំងអស់នៅក្នុងថតឯកសារជាអចិន្ត្រៃយ៍",
      "accept": "លុប",
      "cancel": "បោះបង់"
    }
  },
  "myAccount": {
    "title": "គណនី​របស់ខ្ញុំ",
    "commonActions": {
      "title": "សកម្មភាពទូទៅ",
      "updatePassword": "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",
      "currentPassword": "លេខសំងាត់​បច្ចុប្បន្ន",
      "newPassword": "ពាក្យសម្ងាត់​ថ្មី",
      "confirmPassword": "បញ្ជាក់​លេខសំងាត់​ថ្មី"
    },
    "limits": {
      "gbUsed": "{undefined} ជីកាបៃ",
      "gbTotal": "នៃ {gb} ជីកាបៃ",
      "messagesUsed": [
        "{undefined} សារ",
        "{undefined} សារ",
        "{undefined} សារ"
      ],
      "messagesTotal": [
        "នៃ {undefined} សារ",
        "នៃ {n} សារ",
        "នៃ {undefined} សារ"
      ],
      "storage": {
        "title": "ការផ្ទុក"
      },
      "imapDownload": {
        "title": "ទាញយក IMAP",
        "comment": "រាល់ថ្ងៃ"
      },
      "imapUpload": {
        "title": "ផ្ទុកឡើង IMAP",
        "comment": "រាល់ថ្ងៃ"
      },
      "pop3Download": {
        "title": "ទាញយក POP3",
        "comment": "រាល់ថ្ងៃ"
      },
      "received": {
        "title": "បានទទួល",
        "comment": "ដោយនាទី"
      },
      "recipients": {
        "title": "បានផ្ញើ",
        "comment": "រាល់ថ្ងៃ"
      },
      "forwards": {
        "title": "បញ្ជូនបន្ត",
        "comment": "រាល់ថ្ងៃ"
      }
    }
  },
  "filters": {
    "title": "តម្រង",
    "commingSoon": "នឹងមកដល់ឆាប់ៗនេះ"
  }
};

export default locale;