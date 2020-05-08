import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Kotak masuk",
      "sent": "Terkirim",
      "drafts": "Draf",
      "trash": "Sampah",
      "junk": "Spam"
    },
    "delete": "Hapus folder",
    "empty": "Kotak surat ini kosong"
  },
  "message": {
    "labels": {
      "from": "Dari:",
      "to": "Untuk:",
      "date": "Terkirim:"
    }
  },
  "mailboxMessage": {
    "to": "Untuk:"
  },
  "login": {
    "title": "Masuk",
    "action": "Masuk",
    "labels": {
      "username": "Nama pengguna",
      "password": "Kata sandi"
    }
  },
  "accountButton": {
    "logout": "Keluar",
    "myAccount": "Akun saya"
  },
  "compose": {
    "labels": {
      "to": "Untuk:",
      "subject": "Subyek:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Pesan baru"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Batalkan",
      "redo": "Mengulangi",
      "fontName": "Jenis huruf",
      "fontSize": "Ukuran huruf",
      "bold": "Mencolok",
      "italic": "Miring",
      "underline": "Menggarisbawahi",
      "justifyLeft": "Rata kiri",
      "justifyCenter": "Luruskan tengah",
      "justifyRight": "Rata kanan",
      "insertUnorderedList": "Daftar",
      "insertOrderedList": "Daftar bernomor",
      "removeFormat": "Hapus format"
    },
    "color": {
      "tooltip": "Warna",
      "foreColor": "Teks",
      "backColor": "Latar Belakang"
    },
    "upload": {
      "tooltip": "Melampirkan",
      "add": "Menambahkan",
      "remove": "Menghapus"
    },
    "send": "Kirim"
  },
  "selection": {
    "title": [
      "{n} pesan",
      "{n} pesan",
      "{n} pesan"
    ]
  },
  "actions": {
    "backToMailbox": "Kembali ke kotak surat",
    "reload": "Menyegarkan",
    "select": "Pilih",
    "markAsUnread": "Tandai sebagai tidak dibaca",
    "markAsRead": "tandai sebagai membaca",
    "moveTo": "Pindah ke",
    "delete": "Menghapus",
    "deletePermanently": "Hapus secara permanen",
    "discardDrafts": "Buang konsep",
    "markAsSpam": "Tandai sebagai spam",
    "unMarkAsSpam": "Ini bukan spam",
    "forward": "Meneruskan",
    "reply": "Balasan",
    "attachments": "Lampiran"
  },
  "weekDays": {
    "0": "Minggu",
    "1": "Senin",
    "2": "Selasa",
    "3": "Rabu",
    "4": "Kamis",
    "5": "Jumat",
    "6": "Sabtu"
  },
  "months": {
    "0": "Januari",
    "1": "Februari",
    "2": "Maret",
    "3": "April",
    "4": "Mungkin",
    "5": "Juni",
    "6": "Juli",
    "7": "Agustus",
    "8": "September",
    "9": "Oktober",
    "10": "November",
    "11": "Desember"
  },
  "notifier": {
    "messageSent": "Pesan terkirim",
    "mailboxDeleted": "Folder dihapus"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Folder baru",
      "success": "Folder dibuat"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Buat folder baru",
      "label": "Nama folder",
      "accept": "Membuat",
      "cancel": "Membatalkan"
    },
    "deleteMailbox": {
      "title": "Hapus folder \"{mailbox}\"",
      "desc": "Peringatan. Tindakan ini akan menghapus semua pesan di folder secara permanen",
      "accept": "Menghapus",
      "cancel": "Membatalkan"
    }
  },
  "myAccount": {
    "title": "Akun saya",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "dari {gb} GB",
      "messagesUsed": [
        "{n} pesan",
        "{n} pesan",
        "{n} pesan"
      ],
      "messagesTotal": [
        "dari {n} pesan",
        "dari {n} pesan",
        "dari {n} pesan"
      ],
      "storage": {
        "title": "Penyimpanan"
      },
      "imapDownload": {
        "title": "Unduh IMAP",
        "comment": "harian"
      },
      "imapUpload": {
        "title": "Unggah IMAP",
        "comment": "harian"
      },
      "pop3Download": {
        "title": "Unduh POP3",
        "comment": "harian"
      },
      "received": {
        "title": "Diterima",
        "comment": "per menit"
      },
      "recipients": {
        "title": "Terkirim",
        "comment": "harian"
      },
      "forwards": {
        "title": "Diarahkan kembali",
        "comment": "harian"
      }
    }
  }
};

export default locale;