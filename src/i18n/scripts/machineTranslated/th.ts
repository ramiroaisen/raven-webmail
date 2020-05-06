import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "กล่องขาเข้า",
      "sent": "ส่ง",
      "drafts": "ร่าง",
      "trash": "ขยะ",
      "junk": "สแปม"
    },
    "empty": "กล่องจดหมายนี้ว่างเปล่า"
  },
  "message": {
    "labels": {
      "from": "จาก:",
      "to": "ถึง:",
      "date": "ส่ง:"
    }
  },
  "mailboxMessage": {
    "to": "ถึง:"
  },
  "login": {
    "title": "เข้าสู่ระบบ",
    "action": "เข้าสู่ระบบ",
    "labels": {
      "username": "ชื่อผู้ใช้",
      "password": "รหัสผ่าน"
    }
  },
  "accountButton": {
    "logout": "ออกจากระบบ",
    "myAccount": "บัญชีของฉัน"
  },
  "compose": {
    "labels": {
      "to": "ถึง:",
      "subject": "เรื่อง:",
      "cc": "สำเนา:",
      "bcc": "สำเนาลับ:"
    },
    "tabs": {
      "newMessageTitle": "ข้อความใหม่"
    }
  },
  "editor": {
    "cmd": {
      "undo": "เลิกทำ",
      "redo": "ทำซ้ำ",
      "fontName": "ประเภทตัวอักษร",
      "fontSize": "ขนาดตัวอักษร",
      "bold": "กล้า",
      "italic": "ตัวเอียง",
      "underline": "ขีดเส้นใต้",
      "justifyLeft": "จัดชิดซ้าย",
      "justifyCenter": "จัดกึ่งกลาง",
      "justifyRight": "จัดชิดขวา",
      "insertUnorderedList": "รายการ",
      "insertOrderedList": "รายการลำดับเลข",
      "removeFormat": "ลบรูปแบบ"
    },
    "color": {
      "tooltip": "สี",
      "foreColor": "ข้อความ",
      "backColor": "พื้นหลัง"
    },
    "upload": {
      "tooltip": "แนบ",
      "add": "เพิ่ม",
      "remove": "ลบ"
    },
    "send": "ส่ง"
  },
  "selection": {
    "title": [
      "ข้อความ {n} ข้อความ",
      "ข้อความ {n}",
      "ข้อความ {n} ข้อความ"
    ]
  },
  "actions": {
    "backToMailbox": "กลับไปที่กล่องจดหมาย",
    "reload": "รีเฟรช",
    "select": "เลือก",
    "markAsUnread": "ทำเครื่องหมายว่าไม่ได้อ่าน",
    "markAsRead": "ทำเครื่องหมายว่าอ่านแล้ว",
    "moveTo": "ย้ายไปที่",
    "delete": "ลบ",
    "deletePermanently": "ลบอย่างถาวร",
    "discardDrafts": "ยกเลิกร่างจดหมาย",
    "markAsSpam": "ทำเครื่องหมายว่าเป็นจดหมายขยะ",
    "unMarkAsSpam": "นี่ไม่ใช่สแปม",
    "forward": "ข้างหน้า",
    "reply": "ตอบ",
    "attachments": "สิ่งที่แนบมา"
  },
  "weekDays": {
    "0": "วันอาทิตย์",
    "1": "วันจันทร์",
    "2": "วันอังคาร",
    "3": "วันพุธ",
    "4": "วันพฤหัสบดี",
    "5": "วันศุกร์",
    "6": "วันเสาร์"
  },
  "months": {
    "0": "มกราคม",
    "1": "กุมภาพันธ์",
    "2": "มีนาคม",
    "3": "เมษายน",
    "4": "อาจ",
    "5": "มิถุนายน",
    "6": "กรกฎาคม",
    "7": "สิงหาคม",
    "8": "กันยายน",
    "9": "ตุลาคม",
    "10": "พฤศจิกายน",
    "11": "ธันวาคม"
  },
  "notifier": {
    "messageSent": "ส่งข้อความ"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "แฟ้มใหม่",
      "success": "สร้างโฟลเดอร์แล้ว"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "สร้างโฟลเดอร์ใหม่",
      "label": "ชื่อโฟลเดอร์",
      "accept": "สร้าง",
      "cancel": "ยกเลิก"
    }
  },
  "myAccount": {
    "title": "บัญชีของฉัน",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "จาก {gb} GB",
      "messagesUsed": [
        "ข้อความ {n} ข้อความ",
        "ข้อความ {n}",
        "ข้อความ {n} ข้อความ"
      ],
      "messagesTotal": [
        "จาก {n} ข้อความ",
        "จาก {n} ข้อความ",
        "จาก {n} ข้อความ"
      ],
      "storage": {
        "title": "การเก็บรักษา"
      },
      "imapDownload": {
        "title": "ดาวน์โหลด IMAP",
        "comment": "ประจำวัน"
      },
      "imapUpload": {
        "title": "การอัปโหลด IMAP",
        "comment": "ประจำวัน"
      },
      "pop3Download": {
        "title": "ดาวน์โหลด POP3",
        "comment": "ประจำวัน"
      },
      "received": {
        "title": "ที่ได้รับ",
        "comment": "โดยนาที"
      },
      "recipients": {
        "title": "ส่ง",
        "comment": "ประจำวัน"
      },
      "forwards": {
        "title": "เปลี่ยนเส้นทาง",
        "comment": "ประจำวัน"
      }
    }
  }
};

export default locale;