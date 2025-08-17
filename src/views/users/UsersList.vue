<template>
  <div class="users-list">
    <!-- Filters -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ $t('users.title') }}</h3>
        <div class="card-tools">
          <button class="btn btn-primary btn-sm" @click="showCreateModal">
            <i class="fas fa-plus"></i> {{ $t('users.add_user') }}
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-3">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                :placeholder="$t('users.search_placeholder')"
                v-model="filters.search"
                @input="handleSearch"
              >
              <div class="input-group-append">
                <button class="btn btn-default">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-control" v-model="filters.role" @change="handleSearch">
              <option value="">{{ $t('users.all_roles') }}</option>
              <option value="admin">{{ $t('users.roles.admin') }}</option>
              <option value="user">{{ $t('users.roles.user') }}</option>
            </select>
          </div>
          <div class="col-md-6">
            <div class="float-right">
              <select class="form-control" v-model="selectedAction" style="width: 150px; display: inline-block; margin-right: 10px;">
                <option value="">{{ $t('users.bulk_actions') }}</option>
                <option value="delete">{{ $t('users.actions.delete') }}</option>
                <option value="activate">{{ $t('users.actions.activate') }}</option>
                <option value="deactivate">{{ $t('users.actions.deactivate') }}</option>
              </select>
              <button class="btn btn-secondary" @click="handleBulkAction" :disabled="!selectedAction || selectedUsers.length === 0">
                {{ $t('users.apply') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th width="40">
                  <input type="checkbox" @change="toggleSelectAll" :checked="selectAll">
                </th>
                <th>{{ $t('users.modal.email') }}</th>
                <th>{{ $t('users.modal.phone') }}</th>
                <th>{{ $t('users.modal.role') }}</th>
                <th>{{ $t('users.modal.status') }}</th>
                <th>Created</th>
                <th width="150">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <input 
                    type="checkbox" 
                    :value="user.id" 
                    v-model="selectedUsers"
                    :disabled="user.id === currentUser?.id"
                  >
                </td>
                <td>{{ user.email }}</td>
                <td>{{ user.phone || '-' }}</td>
                <td>
                  <span :class="['badge', user.role === 'admin' ? 'badge-danger' : 'badge-info']">
                    {{ $t(`users.roles.${user.role}`) }}
                  </span>
                </td>
                <td>
                  <span :class="['badge', user.status === 'active' ? 'badge-success' : 'badge-warning']">
                    {{ $t(`users.status.${user.status}`) }}
                  </span>
                </td>
                <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
                <td>
                  <button 
                    class="btn btn-sm btn-info mr-1" 
                    @click="showEditModal(user)"
                    :disabled="user.id === currentUser?.id"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-danger" 
                    @click="handleDelete(user.id)"
                    :disabled="user.id === currentUser?.id"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="7" class="text-center">{{ $t('users.no_users') }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <pagination
          :total="total"
          :per-page="perPage"
          :current-page="currentPage"
          @page-changed="handlePageChange"
        />
      </div>
    </div>

    <!-- User Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" ref="userModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? $t('users.modal.edit_title') : $t('users.modal.create_title') }}</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>{{ $t('users.modal.email') }}</label>
                <input type="email" class="form-control" v-model="userForm.email" required>
              </div>
              <div class="form-group">
                <label>{{ $t('users.modal.phone') }}</label>
                <input type="text" class="form-control" v-model="userForm.phone">
              </div>
              <div class="form-group">
                <label>{{ $t('users.modal.password') }} {{ isEditing ? $t('users.modal.password_help') : '' }}</label>
                <input type="password" class="form-control" v-model="userForm.password" :required="!isEditing">
              </div>
              <div class="form-group">
                <label>{{ $t('users.modal.role') }}</label>
                <select class="form-control" v-model="userForm.role" required>
                  <option value="user">{{ $t('users.roles.user') }}</option>
                  <option value="admin">{{ $t('users.roles.admin') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('users.modal.status') }}</label>
                <select class="form-control" v-model="userForm.status" required>
                  <option value="active">{{ $t('users.status.active') }}</option>
                  <option value="inactive">{{ $t('users.status.inactive') }}</option>
                </select>
              </div>
              <div class="text-right">
                <button type="button" class="btn btn-secondary mr-2" data-dismiss="modal">
                  {{ $t('users.modal.cancel') }}
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? $t('users.modal.update') : $t('users.modal.create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import Pagination from '../../components/Pagination.vue'

export default {
  name: 'UsersList',
  components: {
    Pagination
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
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
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active'
    })
    const isEditing = ref(false)
    const editingUserId = ref(null)
    const userModal = ref(null)

    const currentUser = computed(() => store.state.user)

    const selectAll = computed(() => {
      return users.value.length > 0 && selectedUsers.value.length === users.value.length
    })

    const fetchUsers = async () => {
      try {
        const response = await store.dispatch('fetchUsers', {
          page: currentPage.value,
          per_page: perPage.value,
          search: filters.value.search,
          role: filters.value.role
        })
        users.value = response.data
        total.value = response.total
        // Sync pagination from API response
        if (response.current_page) currentPage.value = response.current_page
        if (response.per_page) perPage.value = response.per_page
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
        selectedUsers.value = users.value
          .filter(user => user.id !== currentUser.value?.id)
          .map(user => user.id)
      }
    }

    const showCreateModal = () => {
      isEditing.value = false
      editingUserId.value = null
      userForm.value = {
        email: '',
        phone: '',
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
        email: user.email,
        phone: user.phone || '',
        password: '',
        role: user.role,
        status: user.status
      }
      $(userModal.value).modal('show')
    }

    const handleSubmit = async () => {
      try {
        if (isEditing.value) {
          await store.dispatch('updateUser', {
            id: editingUserId.value,
            userData: userForm.value
          })
        } else {
          await store.dispatch('createUser', userForm.value)
        }
        $(userModal.value).modal('hide')
        fetchUsers()
        Swal.fire('Success', `User ${isEditing.value ? 'updated' : 'created'} successfully`, 'success')
      } catch (error) {
        console.error('Error saving user:', error)
        Swal.fire('Error', error.response?.data?.message || 'Failed to save user', 'error')
      }
    }

    const handleDelete = async (userId) => {
      const result = await Swal.fire({
        icon: 'warning',
        title: t('users.messages.confirm_delete'),
        showCancelButton: true,
        confirmButtonText: t('users.actions.delete'),
        cancelButtonText: t('users.modal.cancel')
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch('deleteUser', userId)
          Swal.fire({
            icon: 'success',
            title: t('users.messages.user_deleted'),
            showConfirmButton: false,
            timer: 1500
          })
          fetchUsers()
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t('messages.error_occurred'),
            text: error.message
          })
        }
      }
    }

    const handleBulkAction = async () => {
      let confirmMessage = ''
      switch (selectedAction.value) {
        case 'delete':
          confirmMessage = t('users.messages.confirm_bulk_delete')
          break
        case 'activate':
          confirmMessage = t('users.messages.confirm_bulk_activate')
          break
        case 'deactivate':
          confirmMessage = t('users.messages.confirm_bulk_deactivate')
          break
      }

      const result = await Swal.fire({
        icon: 'warning',
        title: confirmMessage,
        showCancelButton: true,
        confirmButtonText: t('users.apply'),
        cancelButtonText: t('users.modal.cancel')
      })

      if (result.isConfirmed) {
        try {
          await store.dispatch('bulkAction', {
            action: selectedAction.value,
            userIds: selectedUsers.value
          })
          
          selectedUsers.value = []
          selectedAction.value = ''
          
          Swal.fire({
            icon: 'success',
            title: t('users.messages.bulk_action_success'),
            showConfirmButton: false,
            timer: 1500
          })
          
          fetchUsers()
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: t('messages.error_occurred'),
            text: error.message
          })
        }
      }
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
      currentUser,
      selectAll,
      handleSearch,
      handlePageChange,
      toggleSelectAll,
      showCreateModal,
      showEditModal,
      handleSubmit,
      handleDelete,
      handleBulkAction
    }
  }
}
</script>

<style scoped>
.card-tools {
  float: right;
  margin-top: -5px;
}
.users-list .badge {
  font-size: 0.9em;
}
.modal-header .close {
  margin: -1rem -1rem -1rem auto;
}
</style>
