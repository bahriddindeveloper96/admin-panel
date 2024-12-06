export default {
  menu: {
    dashboard: 'Boshqaruv paneli',
    users: 'Foydalanuvchilar',
    products: 'Mahsulotlar',
    orders: 'Buyurtmalar',
    settings: 'Sozlamalar',
    reports: 'Hisobotlar',
    categories: 'Kategoriyalar'
  },
  auth: {
    login: 'Kirish',
    logout: 'Chiqish',
    email: 'Email',
    password: 'Parol',
    remember: 'Eslab qolish',
    forgot_password: 'Parolni unutdingizmi?',
    profile: 'Profil',
    settings: 'Sozlamalar'
  },
  common: {
    search: 'Qidirish',
    add: 'Qo\'shish',
    edit: 'Tahrirlash',
    delete: 'O\'chirish',
    delete_selected: 'Tanlanganlarni o\'chirish',
    export: 'Eksport',
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    confirm: 'Tasdiqlash',
    actions: 'Amallar',
    status: {
      active: 'Faol',
      inactive: 'Faol emas'
    },
    date: 'Sana',
    customer: 'Mijoz',
    total: 'Jami',
    more_info: 'Batafsil',
    order_id: 'Buyurtma raqami',
    products: 'Mahsulotlar',
    loading: 'Yuklanmoqda...',
    id: 'ID'
  },
  products: {
    title: 'Mahsulotlar',
    add_product: 'Mahsulot qo\'shish',
    search_placeholder: 'Mahsulotlarni qidirish...',
    no_products: 'Mahsulotlar topilmadi',
    uncategorized: 'Kategoriyasiz',
    table: {
      image: 'Rasm',
      name: 'Nomi',
      category: 'Kategoriya',
      price: 'Narxi',
      stock: 'Ombor',
      status: 'Holati'
    }
  },
  dashboard: {
    new_orders: 'Yangi buyurtmalar',
    products: 'Mahsulotlar',
    users: 'Foydalanuvchilar',
    revenue: 'Daromad',
    recent_orders: 'So\'nggi buyurtmalar',
    sales_chart: 'Sotuvlar grafigi',
    total_orders: 'Jami buyurtmalar',
    sales_overview: 'Sotuvlar ko\'rsatkichi',
    order_status: 'Buyurtma holati'
  },
  orders: {
    title: 'Buyurtmalar',
    filters: {
      search: 'Buyurtmalarni qidirish...',
      all_status: 'Barcha holatlar',
      start_date: 'Boshlanish sanasi',
      end_date: 'Tugash sanasi',
      export: 'Eksport'
    },
    table: {
      order_id: 'Buyurtma ID',
      customer: 'Mijoz',
      status: 'Holat',
      total_amount: 'Umumiy summa',
      items: 'Mahsulotlar',
      date: 'Sana',
      actions: 'Amallar',
      items_count: 'ta mahsulot'
    },
    status: {
      pending: 'Kutilmoqda',
      processing: 'Jarayonda',
      shipped: 'Jo\'natilgan',
      delivered: 'Yetkazilgan',
      cancelled: 'Bekor qilingan'
    },
    modal: {
      update_status: 'Buyurtma holatini yangilash',
      status: 'Holat',
      tracking_number: 'Kuzatish raqami',
      notes: 'Izohlar',
      update: 'Holatni yangilash'
    },
    messages: {
      confirm_delete: 'Ushbu buyurtmani o\'chirishni xohlaysizmi?',
      delete_success: 'Buyurtma muvaffaqiyatli o\'chirildi',
      update_success: 'Buyurtma holati muvaffaqiyatli yangilandi'
    }
  },
  categories: {
    title: 'Kategoriyalar',
    add_category: 'Kategoriya qo\'shish',
    search_placeholder: 'Kategoriyalarni qidirish...',
    no_categories: 'Kategoriyalar topilmadi',
    root_category: 'Asosiy kategoriya',
    table: {
      image: 'Rasm',
      name: 'Nomi',
      parent: 'Asosiy kategoriya',
      products: 'Mahsulotlar',
      status: 'Holati'
    }
  },
  settings: {
    title: 'Sozlamalar',
    general: 'Umumiy sozlamalar',
    notifications: 'Bildirishnomalar',
    security: 'Xavfsizlik',
    appearance: 'Ko\'rinish',
    language: 'Til',
    theme: 'Mavzu',
    dark_mode: 'Tungi rejim',
    email_notifications: {
      title: 'Email bildirishnomalar',
      orders: 'Yangi buyurtmalar',
      products: 'Mahsulot yangilanishlari',
      news: 'Yangiliklar va yangilanishlar'
    },
    password: {
      title: 'Parolni o\'zgartirish',
      current: 'Joriy parol',
      new: 'Yangi parol',
      confirm: 'Parolni tasdiqlang'
    },
    profile: {
      title: 'Profil sozlamalari',
      name: 'Ism',
      name_placeholder: 'Ismingiz',
      email: 'Email',
      email_placeholder: 'Emailingiz',
      avatar: 'Avatar',
      choose_file: 'Faylni tanlang',
      update_profile: 'Profilni yangilash'
    },
    password: {
      title: 'Parolni o\'zgartirish',
      current: 'Joriy parol',
      current_placeholder: 'Joriy parol',
      new: 'Yangi parol',
      new_placeholder: 'Yangi parol',
      confirm: 'Yangi parolni tasdiqlang',
      confirm_placeholder: 'Yangi parolni tasdiqlang',
      change_password: 'Parolni o\'zgartirish'
    },
    preferences: {
      title: 'Sozlamalar',
      theme: 'Mavzu',
      light: 'Yorug\'',
      dark: 'Qorong\'u',
      language: 'Til',
      notifications: 'Bildirishnomalar',
      email_notifications: 'Email bildirishnomalar',
      push_notifications: 'Push bildirishnomalar',
      save_preferences: 'Sozlamalarni saqlash'
    },
    messages: {
      profile_updated: 'Profil muvaffaqiyatli yangilandi',
      password_changed: 'Parol muvaffaqiyatli o\'zgartirildi',
      preferences_saved: 'Sozlamalar muvaffaqiyatli saqlandi'
    },
    save_changes: 'O\'zgarishlarni saqlash',
    changes_saved: 'O\'zgarishlar muvaffaqiyatli saqlandi'
  },
  users: {
    title: 'Foydalanuvchilar',
    add_user: 'Foydalanuvchi qo\'shish',
    search_placeholder: 'Foydalanuvchilarni qidirish...',
    all_roles: 'Barcha rollar',
    bulk_actions: 'Ommaviy harakatlar',
    apply: 'Qo\'llash',
    no_users: 'Foydalanuvchilar topilmadi',
    modal: {
      create_title: 'Foydalanuvchi yaratish',
      edit_title: 'Foydalanuvchini tahrirlash',
      email: 'Email',
      phone: 'Telefon',
      password: 'Parol',
      password_help: '(joriy parolni saqlash uchun bo\'sh qoldiring)',
      role: 'Rol',
      status: 'Holat',
      cancel: 'Bekor qilish',
      create: 'Yaratish',
      update: 'Yangilash'
    },
    roles: {
      admin: 'Administrator',
      user: 'Foydalanuvchi'
    },
    status: {
      active: 'Faol',
      inactive: 'Faol emas'
    },
    actions: {
      delete: 'O\'chirish',
      activate: 'Faollashtirish',
      deactivate: 'Faolsizlantirish'
    },
    messages: {
      confirm_delete: 'Ushbu foydalanuvchini o\'chirishni xohlaysizmi?',
      confirm_bulk_delete: 'Tanlangan foydalanuvchilarni o\'chirishni xohlaysizmi?',
      confirm_bulk_activate: 'Tanlangan foydalanuvchilarni faollashtirishni xohlaysizmi?',
      confirm_bulk_deactivate: 'Tanlangan foydalanuvchilarni faolsizlantirishni xohlaysizmi?',
      user_created: 'Foydalanuvchi muvaffaqiyatli yaratildi',
      user_updated: 'Foydalanuvchi muvaffaqiyatli yangilandi',
      user_deleted: 'Foydalanuvchi muvaffaqiyatli o\'chirildi',
      bulk_action_success: 'Ommaviy harakat muvaffaqiyatli bajarildi'
    }
  },
  reports: {
    title: 'Hisobotlar',
    date_range: {
      label: 'Vaqt oralig\'i',
      today: 'Bugun',
      yesterday: 'Kecha',
      last7days: 'So\'nggi 7 kun',
      last30days: 'So\'nggi 30 kun',
      thisMonth: 'Shu oy',
      lastMonth: 'O\'tgan oy',
      custom: 'Boshqa davr',
      start_date: 'Boshlanish sanasi',
      end_date: 'Tugash sanasi'
    },
    summary: {
      total_sales: 'Jami savdo',
      total_orders: 'Jami buyurtmalar',
      average_order: 'O\'rtacha buyurtma',
      products_sold: 'Sotilgan mahsulotlar'
    },
    charts: {
      sales_overview: 'Savdo ko\'rsatkichlari',
      top_products: 'Top mahsulotlar',
      sales_by_category: 'Kategoriyalar bo\'yicha savdo',
      order_status: 'Buyurtmalar holati'
    },
    products: {
      sold: 'sotildi',
      revenue: 'Daromad'
    },
    orders: {
      recent: 'So\'nggi buyurtmalar',
      export: 'Eksport',
      table: {
        order_id: 'Buyurtma ID',
        customer: 'Mijoz',
        products: 'Mahsulotlar',
        total: 'Summa',
        status: 'Holat',
        date: 'Sana'
      },
      status: {
        pending: 'Kutilmoqda',
        processing: 'Jarayonda',
        shipped: 'Jo\'natilgan',
        delivered: 'Yetkazilgan',
        cancelled: 'Bekor qilingan'
      }
    }
  },
  order_details: {
    order_info: {
      title: 'Buyurtma ma\'lumotlari',
      order_id: 'Buyurtma ID',
      status: 'Holat',
      update_status: 'Holatni yangilash',
      date: 'Sana',
      total_amount: 'Umumiy summa',
      tracking_number: 'Kuzatish raqami',
      notes: 'Izohlar'
    },
    customer_info: {
      title: 'Mijoz ma\'lumotlari',
      name: 'Ism',
      email: 'Email',
      phone: 'Telefon'
    },
    order_items: {
      title: 'Buyurtma mahsulotlari',
      product: 'Mahsulot',
      sku: 'Artikul',
      price: 'Narx',
      quantity: 'Soni',
      total: 'Jami',
      subtotal: 'Oraliq summa',
      shipping: 'Yetkazib berish'
    },
    modal: {
      title: 'Buyurtma holatini yangilash',
      status: 'Holat',
      tracking_number: 'Kuzatish raqami',
      notes: 'Izohlar',
      update: 'Holatni yangilash'
    },
    messages: {
      update_success: 'Buyurtma holati muvaffaqiyatli yangilandi'
    }
  },
  messages: {
    confirm_delete: 'Rostdan ham o\'chirmoqchimisiz?',
    success_save: 'Muvaffaqiyatli saqlandi',
    success_delete: 'Muvaffaqiyatli o\'chirildi',
    error_occurred: 'Xatolik yuz berdi'
  }
}
