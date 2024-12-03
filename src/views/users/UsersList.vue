<template>
  <div class="users-list">
    <!-- Filters -->
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <div class="form-group">
              <input
                type="text"
                class="form-control"
                v-model="filters.search"
                placeholder="Search users..."
                @input="handleSearch"
              >
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <select class="form-control" v-model="filters.role" @change="fetchUsers">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
          <div class="col-md-6 text-right">
            <button class="btn btn-primary" @click="showCreateModal">
              <i class="fas fa-plus"></i> Add User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header">
        <div class="card-tools">
          <div class="input-group input-group-sm">
            <select v-model="selectedAction" class="form-control mr-2">
              <option value="">Bulk Actions</option>
              <option value="delete">Delete</option>
              <option value="block">Block</option>
              <option value="activate">Activate</option>
            </select>
            <button 
              class="btn btn-primary" 
              @click="handleBulkAction"
              :disabled="!selectedUsers.length || !selectedAction"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      <div class="card-body table-responsive p-0">
        <table class="table table-hover">
          <thead>
            <tr>
              <th width="40">
                <input 
                  type="checkbox" 
                  :checked="selectAll" 
                  @change="toggleSelectAll"
                >
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <input 
                  type="checkbox" 
                  :value="user.id" 
                  v-model="selectedUsers"
                >
              </td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="getRoleBadgeClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span :class="getStatusBadgeClass(user.status)">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <button 
                  class="btn btn-sm btn-info mr-1" 
                  @click="showEditModal(user)"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="deleteUser(user.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer clearfix">
        <pagination
          :total="total"
          :per-page="perPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit User' : 'Create User' }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  v-model="userForm.name" 
                  required
                >
              </div>
              <div class="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  v-model="userForm.email" 
                  required
                >
              </div>
              <div class="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  v-model="userForm.password"
                  :required="!isEditing"
                >
              </div>
              <div class="form-group">
                <label>Role</label>
                <select class="form-control" v-model="userForm.role" required>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="form-group">
                <label>Status</label>
                <select class="form-control" v-model="userForm.status" required>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'Update' : 'Create' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Pagination from '../../components/Pagination.vue'

export default {
  name: 'UsersList',
  components: {
    Pagination
  },
  setup() {
    const users = ref([])
    const total = ref(0)
    const perPage = ref(15)
    const currentPage = ref(1)
    const selectedUsers = ref([])
    const selectedAction = ref('')
    const filters = ref({
      search: '',
      role: ''
    })
    const userForm = ref({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    })
    const isEditing = ref(false)
    const editingUserId = ref(null)
    const userModal = ref(null)

    const selectAll = computed(() => {
      return users.value.length > 0 && selectedUsers.value.length === users.value.length
    })

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users', {
          params: {
            page: currentPage.value,
            per_page: perPage.value,
            search: filters.value.search,
            role: filters.value.role
          }
        })
        users.value = response.data.data
        total.value = response.data.total
      } catch (error) {
        console.error('Error fetching users:', error)
        Swal.fire('Error', 'Failed to fetch users', 'error')
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchUsers()
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchUsers()
    }

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedUsers.value = []
      } else {
        selectedUsers.value = users.value.map(user => user.id)
      }
    }

    const showCreateModal = () => {
      isEditing.value = false
      editingUserId.value = null
      userForm.value = {
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active'
      }
      $(userModal.value).modal('show')
    }

    const showEditModal = (user) => {
      isEditing.value = true
      editingUserId.value = user.id
      userForm.value = {
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status
      }
      $(userModal.value).modal('show')
    }

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`/api/admin/users/${editingUserId.value}`, userForm.value)
        } else {
          await axios.post('/api/admin/users', userForm.value)
        }
        $(userModal.value).modal('hide')
        fetchUsers()
        Swal.fire('Success', `User ${isEditing.value ? 'updated' : 'created'} successfully`, 'success')
      } catch (error) {
        console.error('Error saving user:', error)
        Swal.fire('Error', error.response?.data?.message || 'Failed to save user', 'error')
      }
    }

    const deleteUser = async (userId) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/admin/users/${userId}`)
          fetchUsers()
          Swal.fire('Deleted!', 'User has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting user:', error)
          Swal.fire('Error', 'Failed to delete user', 'error')
        }
      }
    }

    const handleBulkAction = async () => {
      if (!selectedUsers.value.length || !selectedAction.value) return

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You are about to ${selectedAction.value} ${selectedUsers.value.length} users`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!'
      })

      if (result.isConfirmed) {
        try {
          await axios.post('/api/admin/users/bulk-action', {
            user_ids: selectedUsers.value,
            action: selectedAction.value
          })
          selectedUsers.value = []
          selectedAction.value = ''
          fetchUsers()
          Swal.fire('Success', 'Bulk action completed successfully', 'success')
        } catch (error) {
          console.error('Error performing bulk action:', error)
          Swal.fire('Error', 'Failed to perform bulk action', 'error')
        }
      }
    }

    const getRoleBadgeClass = (role) => {
      return role === 'admin' ? 'badge badge-primary' : 'badge badge-info'
    }

    const getStatusBadgeClass = (status) => {
      return status === 'active' ? 'badge badge-success' : 'badge badge-danger'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      total,
      perPage,
      currentPage,
      selectedUsers,
      selectedAction,
      filters,
      userForm,
      isEditing,
      userModal,
      selectAll,
      handleSearch,
      handlePageChange,
      toggleSelectAll,
      showCreateModal,
      showEditModal,
      handleSubmit,
      deleteUser,
      handleBulkAction,
      getRoleBadgeClass,
      getStatusBadgeClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.card-tools {
  margin-top: -6px;
}
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
