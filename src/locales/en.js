export default {
  menu: {
    dashboard: 'Dashboard',
    users: 'Users',
    products: 'Products',
    orders: 'Orders',
    settings: 'Settings',
    reports: 'Reports',
    categories: 'Categories'
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    remember: 'Remember me',
    forgot_password: 'Forgot password?',
    profile: 'Profile',
    settings: 'Settings'
  },
  common: {
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    delete_selected: 'Delete Selected',
    export: 'Export',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    actions: 'Actions',
    status: {
      active: 'Active',
      inactive: 'Inactive',
      featured: 'Featured',
      notFeatured: 'Not Featured'
    },
    date: 'Date',
    customer: 'Customer',
    total: 'Total',
    more_info: 'More info',
    order_id: 'Order ID',
    products: 'Products',
    loading: 'Loading...',
    id: 'ID',
    order: 'Order',
    slug: 'Slug',
    name: 'Name',
    description: 'Description',
    type: 'Type',
    required: 'Required',
    filterable: 'Filterable',
    yes: 'Yes',
    no: 'No'
  },
  products: {
    title: 'Products',
    add_product: 'Add Product',
    search_placeholder: 'Search products...',
    no_products: 'No products found',
    uncategorized: 'Uncategorized',
    table: {
      image: 'Image',
      name: 'Name',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      status: 'Status'
    }
  },
  categories: {
    title: 'Categories',
    add_category: 'Add Category',
    search_placeholder: 'Search categories...',
    no_categories: 'No categories found',
    root_category: 'Root Category',
    subcategories: 'Subcategories',
    table: {
      image: 'Image',
      name: 'Name',
      parent: 'Parent Category',
      products: 'Products',
      status: 'Status'
    }
  },
  dashboard: {
    new_orders: 'New Orders',
    products: 'Products',
    users: 'Users',
    revenue: 'Revenue',
    recent_orders: 'Recent Orders',
    sales_chart: 'Sales Chart',
    total_orders: 'Total Orders',
    sales_overview: 'Sales Overview',
    order_status: 'Order Status'
  },
  orders: {
    title: 'Orders',
    filters: {
      search: 'Search orders...',
      all_status: 'All Status',
      start_date: 'Start Date',
      end_date: 'End Date',
      export: 'Export'
    },
    table: {
      order_id: 'Order ID',
      customer: 'Customer',
      status: 'Status',
      total_amount: 'Total Amount',
      items: 'Items',
      date: 'Date',
      actions: 'Actions',
      items_count: 'items'
    },
    status: {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    },
    modal: {
      update_status: 'Update Order Status',
      status: 'Status',
      tracking_number: 'Tracking Number',
      notes: 'Notes',
      update: 'Update Status'
    },
    messages: {
      confirm_delete: 'Are you sure you want to delete this order?',
      delete_success: 'Order has been deleted successfully',
      update_success: 'Order status has been updated successfully'
    }
  },
  messages: {
    confirm_delete: 'Are you sure you want to delete?',
    success_save: 'Successfully saved',
    success_delete: 'Successfully deleted',
    error_occurred: 'An error occurred'
  },
  settings: {
    title: 'Settings',
    general: 'General Settings',
    notifications: 'Notifications',
    security: 'Security',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
    dark_mode: 'Dark Mode',
    email_notifications: {
      title: 'Email Notifications',
      orders: 'New Orders',
      products: 'Product Updates',
      news: 'News and Updates'
    },
    password: {
      title: 'Change Password',
      current: 'Current Password',
      new: 'New Password',
      confirm: 'Confirm Password'
    },
    save_changes: 'Save Changes',
    changes_saved: 'Changes saved successfully',
    profile: {
      title: 'Profile Settings',
      name: 'Name',
      name_placeholder: 'Your name',
      email: 'Email',
      email_placeholder: 'Your email',
      avatar: 'Avatar',
      choose_file: 'Choose file',
      update_profile: 'Update Profile'
    },
    password: {
      title: 'Change Password',
      current: 'Current Password',
      current_placeholder: 'Current password',
      new: 'New Password',
      new_placeholder: 'New password',
      confirm: 'Confirm New Password',
      confirm_placeholder: 'Confirm new password',
      change_password: 'Change Password'
    },
    preferences: {
      title: 'Preferences',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      language: 'Language',
      notifications: 'Notifications',
      email_notifications: 'Email Notifications',
      push_notifications: 'Push Notifications',
      save_preferences: 'Save Preferences'
    },
    messages: {
      profile_updated: 'Profile updated successfully',
      password_changed: 'Password changed successfully',
      preferences_saved: 'Preferences saved successfully'
    }
  },
  users: {
    title: 'Users',
    add_user: 'Add User',
    search_placeholder: 'Search users...',
    all_roles: 'All Roles',
    bulk_actions: 'Bulk Actions',
    apply: 'Apply',
    no_users: 'No users found',
    modal: {
      create_title: 'Create User',
      edit_title: 'Edit User',
      email: 'Email',
      phone: 'Phone',
      password: 'Password',
      password_help: '(leave empty to keep current)',
      role: 'Role',
      status: 'Status',
      cancel: 'Cancel',
      create: 'Create',
      update: 'Update'
    },
    roles: {
      admin: 'Admin',
      user: 'User'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive'
    },
    actions: {
      delete: 'Delete',
      activate: 'Activate',
      deactivate: 'Deactivate'
    },
    messages: {
      confirm_delete: 'Are you sure you want to delete this user?',
      confirm_bulk_delete: 'Are you sure you want to delete selected users?',
      confirm_bulk_activate: 'Are you sure you want to activate selected users?',
      confirm_bulk_deactivate: 'Are you sure you want to deactivate selected users?',
      user_created: 'User created successfully',
      user_updated: 'User updated successfully',
      user_deleted: 'User deleted successfully',
      bulk_action_success: 'Bulk action completed successfully'
    }
  },
  reports: {
    title: 'Reports',
    date_range: {
      label: 'Date Range',
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 Days',
      last30days: 'Last 30 Days',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      custom: 'Custom Range',
      start_date: 'Start Date',
      end_date: 'End Date'
    },
    summary: {
      total_sales: 'Total Sales',
      total_orders: 'Total Orders',
      average_order: 'Average Order Value',
      products_sold: 'Products Sold'
    },
    charts: {
      sales_overview: 'Sales Overview',
      top_products: 'Top Products',
      sales_by_category: 'Sales by Category',
      order_status: 'Order Status Distribution'
    },
    products: {
      sold: 'sold',
      revenue: 'Revenue'
    },
    orders: {
      recent: 'Recent Orders',
      export: 'Export',
      table: {
        order_id: 'Order ID',
        customer: 'Customer',
        products: 'Products',
        total: 'Total',
        status: 'Status',
        date: 'Date'
      },
      status: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    }
  },
  
order_details: {
  order_info: {
    title: "Order Information",
    order_number: "Order Number",
    status: "Status",
    update_status: "Update Status",
    payment_status: "Payment Status",
    created_at: "Created At",
    total_amount: "Total Amount",
    delivery_cost: "Delivery Cost",
    total_discount: "Total Discount"
  },
  customer_info: {
    title: "Customer Information",
    name: "Name",
    email: "Email",
    phone: "Phone"
  },
  delivery_info: {
    title: "Delivery Information",
    name: "Recipient Name",
    phone: "Recipient Phone",
    address: "Address",
    method: "Delivery Method",
    comment: "Delivery Comment"
  },
  order_items: {
    title: "Order Items",
    product: "Product",
    price: "Price",
    quantity: "Quantity",
    total: "Total",
    subtotal: "Subtotal",
    delivery_cost: "Delivery Cost",
    discount: "Discount"
  },
  status_history: {
    title: "Status History",
    date: "Date",
    from: "From",
    to: "To",
    comment: "Comment"
  },
  modal: {
    title: "Update Order Status",
    status: "Status",
    tracking_number: "Tracking Number",
    notes: "Notes",
    update: "Update"
  },
  messages: {
    update_success: "Order status updated successfully"
  }
},
orders: {
  statuses: {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled"
  }
    
  }
  
}
