export default {
  menu: {
    dashboard: 'Панель управления',
    users: 'Пользователи',
    products: 'Товары',
    orders: 'Заказы',
    settings: 'Настройки',
    reports: 'Отчеты',
    categories: 'Категории'
  },
  auth: {
    login: 'Войти',
    logout: 'Выйти',
    email: 'Email',
    password: 'Пароль',
    remember: 'Запомнить меня',
    forgot_password: 'Забыли пароль?',
    profile: 'Профиль',
    settings: 'Настройки'
  },
  common: {
    search: 'Поиск',
    add: 'Добавить',
    edit: 'Редактировать',
    delete: 'Удалить',
    delete_selected: 'Удалить выбранные',
    export: 'Экспорт',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    actions: 'Действия',
    status: {
      active: 'Активный',
      inactive: 'Неактивный'
    },
    date: 'Дата',
    customer: 'Клиент',
    total: 'Всего',
    more_info: 'Подробнее',
    order_id: 'Номер заказа',
    products: 'Товары',
    loading: 'Загрузка...',
    id: 'ID'
  },
  products: {
    title: 'Товары',
    add_product: 'Добавить товар',
    search_placeholder: 'Поиск товаров...',
    no_products: 'Товары не найдены',
    uncategorized: 'Без категории',
    table: {
      image: 'Изображение',
      name: 'Название',
      category: 'Категория',
      price: 'Цена',
      stock: 'Остаток',
      status: 'Статус'
    }
  },
  dashboard: {
    new_orders: 'Новые заказы',
    products: 'Товары',
    users: 'Пользователи',
    revenue: 'Доход',
    recent_orders: 'Последние заказы',
    sales_chart: 'График продаж',
    total_orders: 'Всего заказов',
    sales_overview: 'Обзор продаж',
    order_status: 'Статус заказа'
  },
  orders: {
    title: 'Заказы',
    filters: {
      search: 'Поиск заказов...',
      all_status: 'Все статусы',
      start_date: 'Дата начала',
      end_date: 'Дата окончания',
      export: 'Экспорт'
    },
    table: {
      order_id: 'ID заказа',
      customer: 'Клиент',
      status: 'Статус',
      total_amount: 'Сумма',
      items: 'Товары',
      date: 'Дата',
      actions: 'Действия',
      items_count: 'товаров'
    },
    status: {
      pending: 'В обработке',
      processing: 'Обрабатывается',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
    },
    modal: {
      update_status: 'Обновить статус заказа',
      status: 'Статус',
      tracking_number: 'Номер отслеживания',
      notes: 'Примечания',
      update: 'Обновить статус'
    },
    messages: {
      confirm_delete: 'Вы уверены, что хотите удалить этот заказ?',
      delete_success: 'Заказ успешно удален',
      update_success: 'Статус заказа успешно обновлен'
    }
  },
  categories: {
    title: 'Категории',
    add_category: 'Добавить категорию',
    search_placeholder: 'Поиск категорий...',
    no_categories: 'Категории не найдены',
    root_category: 'Корневая категория',
    table: {
      image: 'Изображение',
      name: 'Название',
      parent: 'Родительская категория',
      products: 'Товары',
      status: 'Статус'
    }
  },
  settings: {
    title: 'Настройки',
    general: 'Общие настройки',
    notifications: 'Уведомления',
    security: 'Безопасность',
    appearance: 'Внешний вид',
    language: 'Язык',
    theme: 'Тема',
    dark_mode: 'Темный режим',
    email_notifications: {
      title: 'Email уведомления',
      orders: 'Новые заказы',
      products: 'Обновления товаров',
      news: 'Новости и обновления'
    },
    password: {
      title: 'Изменить пароль',
      current: 'Текущий пароль',
      new: 'Новый пароль',
      confirm: 'Подтвердите пароль'
    },
    profile: {
      title: 'Настройки профиля',
      name: 'Имя',
      name_placeholder: 'Ваше имя',
      email: 'Email',
      email_placeholder: 'Ваш email',
      avatar: 'Аватар',
      choose_file: 'Выберите файл',
      update_profile: 'Обновить профиль'
    },
    password: {
      title: 'Изменить пароль',
      current: 'Текущий пароль',
      current_placeholder: 'Текущий пароль',
      new: 'Новый пароль',
      new_placeholder: 'Новый пароль',
      confirm: 'Подтвердите новый пароль',
      confirm_placeholder: 'Подтвердите новый пароль',
      change_password: 'Изменить пароль'
    },
    preferences: {
      title: 'Настройки',
      theme: 'Тема',
      light: 'Светлая',
      dark: 'Темная',
      language: 'Язык',
      notifications: 'Уведомления',
      email_notifications: 'Email уведомления',
      push_notifications: 'Push уведомления',
      save_preferences: 'Сохранить настройки'
    },
    messages: {
      profile_updated: 'Профиль успешно обновлен',
      password_changed: 'Пароль успешно изменен',
      preferences_saved: 'Настройки успешно сохранены'
    },
    save_changes: 'Сохранить изменения',
    changes_saved: 'Изменения успешно сохранены'
  },
  users: {
    title: 'Пользователи',
    add_user: 'Добавить пользователя',
    search_placeholder: 'Поиск пользователей...',
    all_roles: 'Все роли',
    bulk_actions: 'Массовые действия',
    apply: 'Применить',
    no_users: 'Пользователи не найдены',
    modal: {
      create_title: 'Создать пользователя',
      edit_title: 'Редактировать пользователя',
      email: 'Email',
      phone: 'Телефон',
      password: 'Пароль',
      password_help: '(оставьте пустым, чтобы сохранить текущий)',
      role: 'Роль',
      status: 'Статус',
      cancel: 'Отмена',
      create: 'Создать',
      update: 'Обновить'
    },
    roles: {
      admin: 'Администратор',
      user: 'Пользователь'
    },
    status: {
      active: 'Активный',
      inactive: 'Неактивный'
    },
    actions: {
      delete: 'Удалить',
      activate: 'Активировать',
      deactivate: 'Деактивировать'
    },
    messages: {
      confirm_delete: 'Вы уверены, что хотите удалить этого пользователя?',
      confirm_bulk_delete: 'Вы уверены, что хотите удалить выбранных пользователей?',
      confirm_bulk_activate: 'Вы уверены, что хотите активировать выбранных пользователей?',
      confirm_bulk_deactivate: 'Вы уверены, что хотите деактивировать выбранных пользователей?',
      user_created: 'Пользователь успешно создан',
      user_updated: 'Пользователь успешно обновлен',
      user_deleted: 'Пользователь успешно удален',
      bulk_action_success: 'Массовое действие успешно выполнено'
    }
  },
  reports: {
    title: 'Отчеты',
    date_range: {
      label: 'Период',
      today: 'Сегодня',
      yesterday: 'Вчера',
      last7days: 'Последние 7 дней',
      last30days: 'Последние 30 дней', 
      thisMonth: 'Этот месяц',
      lastMonth: 'Прошлый месяц',
      custom: 'Произвольный период',
      start_date: 'Дата начала',
      end_date: 'Дата окончания'
    },
    summary: {
      total_sales: 'Общие продажи',
      total_orders: 'Всего заказов',
      average_order: 'Средний чек',
      products_sold: 'Продано товаров'
    },
    charts: {
      sales_overview: 'Обзор продаж',
      top_products: 'Топ товаров',
      sales_by_category: 'Продажи по категориям',
      order_status: 'Распределение статусов заказов'
    },
    products: {
      sold: 'продано',
      revenue: 'Выручка'
    },
    orders: {
      recent: 'Последние заказы',
      export: 'Экспорт',
      table: {
        order_id: 'ID заказа',
        customer: 'Клиент',
        products: 'Товары',
        total: 'Сумма',
        status: 'Статус',
        date: 'Дата'
      },
      status: {
        pending: 'В обработке',
        processing: 'Обрабатывается',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        cancelled: 'Отменен'
      }
    }
  },
  order_details: {
    order_info: {
      title: 'Информация о заказе',
      order_id: 'ID заказа',
      status: 'Статус',
      update_status: 'Обновить статус',
      date: 'Дата',
      total_amount: 'Общая сумма',
      tracking_number: 'Номер отслеживания',
      notes: 'Примечания'
    },
    customer_info: {
      title: 'Информация о клиенте',
      name: 'Имя',
      email: 'Email',
      phone: 'Телефон'
    },
    order_items: {
      title: 'Товары в заказе',
      product: 'Товар',
      sku: 'Артикул',
      price: 'Цена',
      quantity: 'Количество',
      total: 'Итого',
      subtotal: 'Подытог',
      shipping: 'Доставка'
    },
    modal: {
      title: 'Обновить статус заказа',
      status: 'Статус',
      tracking_number: 'Номер отслеживания',
      notes: 'Примечания',
      update: 'Обновить статус'
    },
    messages: {
      update_success: 'Статус заказа успешно обновлен'
    }
  },
  messages: {
    confirm_delete: 'Вы уверены, что хотите удалить?',
    success_save: 'Успешно сохранено',
    success_delete: 'Успешно удалено',
    error_occurred: 'Произошла ошибка'
  }
}
