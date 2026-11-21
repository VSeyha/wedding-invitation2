<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.guests') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Manage wedding guests, invitation links, and import from Excel spreadsheets.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5 self-start">
        <!-- Download Excel Template -->
        <button
          @click="downloadExcelTemplate"
          type="button"
          class="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm"
          title="Download sample Excel template (Participant_Registry_2.xlsx)"
        >
          <Download class="w-4 h-4 text-[#C9A24A]" />
          <span>Template (.xlsx)</span>
        </button>

        <!-- Import Excel Button -->
        <button
          @click="openImportModal"
          type="button"
          class="btn-secondary flex items-center gap-1.5 text-xs sm:text-sm border-[#C9A24A] hover:bg-[#FFF9EE]"
          title="Import guests from Excel (.xlsx, .xls, .csv)"
        >
          <FileSpreadsheet class="w-4 h-4 text-green-700" />
          <span>Import Excel</span>
        </button>

        <!-- Add Single Guest Button -->
        <button @click="openCreateModal" class="btn-primary flex items-center gap-1.5 text-xs sm:text-sm">
          <UserPlus class="w-4 h-4" />
          <span>Add Guest</span>
        </button>
      </div>
    </div>

    <!-- Search & Side Filter -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="w-full sm:max-w-sm">
        <input v-model="search" type="text" placeholder="Search guests by name, note, phone..." class="input-field" />
      </div>

      <!-- Side Filter Tabs -->
      <div class="flex items-center gap-1.5 p-1 bg-white border border-[#C9A24A]/30 rounded-xl shadow-xs self-start sm:self-auto text-xs">
        <button
          type="button"
          @click="sideFilter = 'all'"
          class="px-3 py-1.5 rounded-lg font-medium transition-all focus:outline-none focus:ring-0"
          :class="sideFilter === 'all' ? 'bg-[#641D2D] text-[#F7F0E3] font-bold shadow-xs' : 'text-[#3C2925]/70 hover:text-[#641D2D] hover:bg-[#F7F0E3]'"
        >
          All ({{ guests.length }})
        </button>
        <button
          type="button"
          @click="sideFilter = 'groom'"
          class="px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all focus:outline-none focus:ring-0"
          :class="sideFilter === 'groom' ? 'bg-emerald-700 text-white font-bold shadow-xs' : 'text-emerald-800 hover:bg-emerald-50'"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>ខាងប្រុស ({{ groomCount }})</span>
        </button>
        <button
          type="button"
          @click="sideFilter = 'bride'"
          class="px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all focus:outline-none focus:ring-0"
          :class="sideFilter === 'bride' ? 'bg-rose-700 text-white font-bold shadow-xs' : 'text-rose-800 hover:bg-rose-50'"
        >
          <span class="w-2 h-2 rounded-full bg-rose-400"></span>
          <span>ខាងស្រី ({{ brideCount }})</span>
        </button>
        <button
          v-if="unassignedCount > 0"
          type="button"
          @click="sideFilter = 'unassigned'"
          class="px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all focus:outline-none focus:ring-0"
          :class="sideFilter === 'unassigned' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-amber-800 hover:bg-amber-50'"
        >
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>មិនទាន់កំណត់ ({{ unassignedCount }})</span>
        </button>
      </div>
    </div>

    <!-- Quick Batch Assign Banner if unassigned guests exist -->
    <div
      v-if="unassignedCount > 0 && sideFilter === 'all'"
      class="mb-3.5 p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
    >
      <div class="flex items-center gap-2 text-amber-900 font-medium">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <span>
          <strong>{{ unassignedCount }}</strong> ភ្ញៀវមិនទាន់បានកំណត់ខាង (unassigned). Assign in 1-click:
        </span>
      </div>
      <div class="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          @click="batchAssignUnassigned('ខាងប្រុស')"
          :disabled="batchAssigning"
          class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-xs"
        >
          {{ batchAssigning ? 'Updating...' : 'Set All to ខាងប្រុស' }}
        </button>
        <button
          type="button"
          @click="batchAssignUnassigned('ខាងស្រី')"
          :disabled="batchAssigning"
          class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-xs"
        >
          {{ batchAssigning ? 'Updating...' : 'Set All to ខាងស្រី' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-[#C9A24A]/20 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#641D2D]/5 border-b border-[#C9A24A]/20">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Name</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Side / Note (ខាង)</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Phone</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Status</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">RSVP</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Opened</th>
              <th class="text-right px-4 py-3 font-semibold text-[#641D2D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="7" class="px-4 py-8 text-center text-[#3C2925]/50">Loading...</td></tr>
            <tr v-else-if="!filteredGuests.length"><td colspan="7" class="px-4 py-8 text-center text-[#3C2925]/50">No guests found.</td></tr>
            <tr
              v-for="guest in paginatedGuests"
              :key="guest.id"
              class="border-b border-[#C9A24A]/10 hover:bg-[#F7F0E3]/50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-[#3C2925]">{{ guest.name }}</td>
              <td class="px-4 py-3">
                <!-- If assigned to ខាងប្រុស or ខាងស្រី: clickable toggle -->
                <button
                  v-if="guest.note === 'ខាងប្រុស' || (guest.note && guest.note.includes('ខាងប្រុស'))"
                  type="button"
                  @click="toggleGuestSide(guest)"
                  :disabled="updatingSideId === guest.id"
                  title="Click to toggle to ខាងស្រី"
                  class="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{{ guest.note }}</span>
                  <span class="text-[10px] text-emerald-600 opacity-60 group-hover:opacity-100">⇄</span>
                </button>
                <button
                  v-else-if="guest.note === 'ខាងស្រី' || (guest.note && guest.note.includes('ខាងស្រី'))"
                  type="button"
                  @click="toggleGuestSide(guest)"
                  :disabled="updatingSideId === guest.id"
                  title="Click to toggle to ខាងប្រុស"
                  class="group inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 hover:border-rose-400 transition-all cursor-pointer"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>{{ guest.note }}</span>
                  <span class="text-[10px] text-rose-600 opacity-60 group-hover:opacity-100">⇄</span>
                </button>
                <span
                  v-else-if="guest.note"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                >
                  {{ guest.note }}
                </span>
                <!-- Quick 1-click assign if unassigned -->
                <div v-else class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="quickSetSide(guest, 'ខាងប្រុស')"
                    :disabled="updatingSideId === guest.id"
                    title="Assign to Groom side (ខាងប្រុស)"
                    class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition-colors"
                  >
                    + ខាងប្រុស
                  </button>
                  <button
                    type="button"
                    @click="quickSetSide(guest, 'ខាងស្រី')"
                    :disabled="updatingSideId === guest.id"
                    title="Assign to Bride side (ខាងស្រី)"
                    class="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 transition-colors"
                  >
                    + ខាងស្រី
                  </button>
                </div>
              </td>
              <td class="px-4 py-3 text-[#3C2925]/70">{{ guest.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span v-if="invitation(guest)?.status === 'active'" class="badge-success">Active</span>
                <span v-else-if="invitation(guest)?.status === 'revoked'" class="badge-error">Revoked</span>
                <span v-else class="badge-neutral">No Invite</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span v-if="rsvp(guest) === 'attending'" class="badge-success">✓ Attending</span>
                  <span v-else-if="rsvp(guest) === 'not_attending'" class="badge-error">✗ Declined</span>
                  <span v-else class="badge-neutral">Pending</span>

                  <!-- Quick Reset to Pending Button -->
                  <button
                    v-if="rsvp(guest)"
                    type="button"
                    @click="updateRsvpStatus(guest, 'pending')"
                    :disabled="updatingRsvpId === guest.id"
                    title="Reset RSVP status back to Pending"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    <RotateCcw class="w-3 h-3" :class="{ 'animate-spin': updatingRsvpId === guest.id }" />
                    <span>Reset</span>
                  </button>
                </div>
              </td>
              <td class="px-4 py-3 text-[#3C2925]/60 text-xs">
                {{ invitation(guest)?.opened_at ? new Date(invitation(guest).opened_at).toLocaleDateString() : '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="rsvp(guest)"
                    @click="updateRsvpStatus(guest, 'pending')"
                    :disabled="updatingRsvpId === guest.id"
                    title="Reset RSVP back to Pending"
                    class="btn-icon text-amber-600 hover:text-amber-700"
                  >
                    <RotateCcw class="w-4 h-4" :class="{ 'animate-spin': updatingRsvpId === guest.id }" />
                  </button>
                  <button @click="copyLink(guest)" title="Copy invite link" class="btn-icon text-neutral-600 hover:text-[#641D2D]">
                    <Copy class="w-4 h-4" />
                  </button>
                  <button @click="openEditModal(guest)" title="Edit guest" class="btn-icon text-neutral-600 hover:text-[#641D2D]">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(guest)" title="Delete guest" class="btn-icon text-red-500 hover:text-red-700">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <AdminPagination
        :total-items="filteredGuests.length"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        item-name="guests"
      />
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-[#641D2D] mb-4">{{ editingGuest ? 'Edit Guest' : 'Add New Guest' }}</h2>
        <form @submit.prevent="submitGuest" class="space-y-4">
          <div>
            <label class="form-label">Guest Name (ឈ្មោះ) *</label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="e.g. Van Sopheamen" />
          </div>

          <!-- Side / Note Selector -->
          <div>
            <label class="form-label">Side / Note (ខាង / ចំណាំ)</label>
            <div class="flex items-center gap-2 mb-2">
              <button
                type="button"
                @click="form.note = 'ខាងប្រុស'"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all"
                :class="form.note === 'ខាងប្រុស' ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400/30 font-bold' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
              >
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                ខាងប្រុស (Groom)
              </button>
              <button
                type="button"
                @click="form.note = 'ខាងស្រី'"
                class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all"
                :class="form.note === 'ខាងស្រី' ? 'bg-rose-100 text-rose-900 border-rose-400 ring-2 ring-rose-400/30 font-bold' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
              >
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1"></span>
                ខាងស្រី (Bride)
              </button>
              <button
                v-if="form.note"
                type="button"
                @click="form.note = ''"
                class="text-[11px] text-gray-400 hover:text-gray-600 underline ml-auto"
              >
                Clear
              </button>
            </div>
            <input v-model="form.note" type="text" class="input-field text-xs" placeholder="ខាងប្រុស, ខាងស្រី, or custom note" />
          </div>

          <div>
            <label class="form-label">Phone (optional)</label>
            <input v-model="form.phone" type="text" class="input-field" placeholder="+855 12 345 678" />
          </div>

          <!-- RSVP Status Selector in Edit Modal -->
          <div v-if="editingGuest">
            <label class="form-label">RSVP Status (ស្ថានភាពឆ្លើយតប)</label>
            <div class="flex items-center gap-2 mt-1">
              <button
                type="button"
                @click="form.rsvp_status = 'pending'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                :class="form.rsvp_status === 'pending' || !form.rsvp_status ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-400/30' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
              >
                ⏳ Pending
              </button>
              <button
                type="button"
                @click="form.rsvp_status = 'attending'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                :class="form.rsvp_status === 'attending' ? 'bg-green-100 text-green-900 border-green-400 ring-2 ring-green-400/30' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
              >
                ✓ Attending
              </button>
              <button
                type="button"
                @click="form.rsvp_status = 'not_attending'"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                :class="form.rsvp_status === 'not_attending' ? 'bg-red-100 text-red-900 border-red-400 ring-2 ring-red-400/30' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'"
              >
                ✗ Declined
              </button>
            </div>
            <p class="text-[11px] text-gray-500 mt-1">Select "Pending" to reset the guest's RSVP response back to unconfirmed.</p>
          </div>
          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="submitting" class="btn-primary">
              {{ submitting ? 'Saving...' : editingGuest ? 'Save Changes' : 'Add Guest' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deletingGuest" class="modal-overlay" @click.self="deletingGuest = null">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-red-700 mb-2">Delete Guest?</h2>
        <p class="text-sm text-[#3C2925]/80 mb-4">
          Delete <strong>{{ deletingGuest.name }}</strong>? This will also remove their invitation and RSVP.
        </p>
        <div class="flex gap-3">
          <button @click="deleteGuest" :disabled="submitting" class="btn-danger">{{ submitting ? 'Deleting...' : 'Yes, Delete' }}</button>
          <button @click="deletingGuest = null" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Excel Import Modal -->
    <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
      <div class="modal-box max-w-xl">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700">
              <FileSpreadsheet class="w-5 h-5" />
            </div>
            <div>
              <h2 class="text-lg font-bold text-[#641D2D]">Import Guests from Excel</h2>
              <p class="text-xs text-[#3C2925]/60 font-khmer-body">នាំចូលបញ្ជីភ្ញៀវពីឯកសារ Excel (.xlsx, .xls, .csv)</p>
            </div>
          </div>
          <button @click="closeImportModal" class="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <!-- Step 1: File Dropzone (if no file parsed yet) -->
        <div v-if="!parsedImportGuests.length" class="space-y-4">
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onFileDrop"
            class="border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative"
            :class="isDragging ? 'border-[#641D2D] bg-[#FFF9EE]' : 'border-gray-300 hover:border-[#C9A24A] bg-gray-50/50'"
            @click="triggerFileInput"
          >
            <input
              ref="fileInputRef"
              type="file"
              accept=".xlsx,.xls,.csv"
              class="hidden"
              @change="onFileSelected"
            />
            <div class="w-12 h-12 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
              <Upload class="w-6 h-6" />
            </div>
            <div class="font-semibold text-sm text-[#3C2925]">
              Drop your Excel spreadsheet here, or <span class="text-[#641D2D] underline">Browse</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Supports .xlsx, .xls, and .csv files</p>
            <div class="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
              <span>💡</span>
              <span>Automatically detects guest names from "Name" column</span>
            </div>
          </div>

          <!-- Sample Template Helper -->
          <div class="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F0E3]/60 border border-[#C9A24A]/30">
            <div>
              <div class="text-xs font-bold text-[#641D2D]">Need a starting template?</div>
              <div class="text-[11px] text-[#3C2925]/70">Participant_Registry_2.xlsx with guest names</div>
            </div>
            <button
              @click="downloadExcelTemplate"
              type="button"
              class="px-3 py-1.5 rounded-lg bg-white border border-[#C9A24A]/60 text-xs font-bold text-[#641D2D] hover:bg-[#FFF9EE] flex items-center gap-1 shadow-sm transition-all"
            >
              <Download class="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Participant_Registry_2.xlsx</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Parsed Table Preview & Confirmation -->
        <div v-else class="space-y-4">
          <!-- Summary Bar -->
          <div class="flex flex-wrap items-center justify-between bg-[#F7F0E3]/70 p-3 rounded-xl border border-[#C9A24A]/30 text-xs gap-2">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span class="font-bold text-[#641D2D]">
                {{ selectedImportCount }} of {{ parsedImportGuests.length }} guests selected
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="toggleSelectAllImport"
                class="text-[11px] text-[#641D2D] font-bold hover:underline"
              >
                {{ isAllImportSelected ? 'Deselect All' : 'Select All' }}
              </button>
              <button
                type="button"
                @click="clearImportFile"
                class="text-[11px] text-red-600 hover:underline"
              >
                Choose another file
              </button>
            </div>
          </div>

          <div class="flex items-center gap-2 px-1 text-xs text-[#3C2925]">
            <input
              id="syncExistingGuests"
              type="checkbox"
              v-model="updateExistingGuests"
              class="rounded text-[#641D2D] focus:ring-[#641D2D]"
            />
            <label for="syncExistingGuests" class="cursor-pointer font-medium text-[11px] sm:text-xs text-[#3C2925]">
              Update existing guests with matching names (syncs Side / Note from Excel)
            </label>
          </div>

          <!-- Scrollable Table Preview -->
          <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-xl overflow-x-auto">
            <table class="w-full text-xs">
              <thead class="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th class="w-8 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      :checked="isAllImportSelected"
                      @change="toggleSelectAllImport"
                      class="rounded text-[#641D2D] focus:ring-[#641D2D]"
                    />
                  </th>
                  <th class="text-left px-3 py-2 font-semibold text-[#641D2D]">#</th>
                  <th class="text-left px-3 py-2 font-semibold text-[#641D2D]">Guest Name (ឈ្មោះ)</th>
                  <th class="text-left px-3 py-2 font-semibold text-[#641D2D]">Side / Note (ខាង)</th>
                  <th class="text-left px-3 py-2 font-semibold text-[#641D2D]">Phone (ទូរស័ព្ទ)</th>
                  <th class="text-right px-3 py-2 font-semibold text-[#641D2D]">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(item, idx) in parsedImportGuests"
                  :key="idx"
                  class="hover:bg-gray-50 transition-colors"
                  :class="{ 'bg-blue-50/40': item.isDuplicate }"
                >
                  <td class="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      v-model="item.selected"
                      class="rounded text-[#641D2D] focus:ring-[#641D2D]"
                    />
                  </td>
                  <td class="px-3 py-2 text-gray-400 font-mono text-[10px]">{{ idx + 1 }}</td>
                  <td class="px-3 py-2 font-medium text-[#3C2925]">{{ item.name }}</td>
                  <td class="px-3 py-2">
                    <span
                      v-if="item.note === 'ខាងប្រុស' || (item.note && item.note.includes('ខាងប្រុស'))"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
                    >
                      ខាងប្រុស
                    </span>
                    <span
                      v-else-if="item.note === 'ខាងស្រី' || (item.note && item.note.includes('ខាងស្រី'))"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200"
                    >
                      ខាងស្រី
                    </span>
                    <span
                      v-else-if="item.note"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      {{ item.note }}
                    </span>
                    <span v-else class="text-gray-300">—</span>
                  </td>
                  <td class="px-3 py-2 text-gray-600 font-mono">{{ item.phone || '—' }}</td>
                  <td class="px-3 py-2 text-right">
                    <span
                      v-if="item.isDuplicate"
                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800"
                      title="Name already exists in list; side and details will be updated"
                    >
                      Update Note
                    </span>
                    <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                      New Guest
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="importError" class="text-red-600 text-xs font-medium">{{ importError }}</div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100">
            <span class="text-xs text-gray-500">Each imported guest receives an active invitation link.</span>
            <div class="flex gap-2.5">
              <button
                type="button"
                @click="closeImportModal"
                class="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="executeImport"
                :disabled="importing || selectedImportCount === 0"
                class="btn-primary flex items-center gap-1.5 text-xs"
              >
                <Upload class="w-3.5 h-3.5" />
                <span>{{ importing ? `Importing ${selectedImportCount}...` : `Import ${selectedImportCount} Guests` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { Copy, Pencil, Trash2, UserPlus, FileSpreadsheet, Download, Upload, RotateCcw } from 'lucide-vue-next'
import * as XLSX from 'xlsx'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()
const config = useRuntimeConfig()

const guests = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const showModal = ref(false)
const editingGuest = ref<any>(null)
const deletingGuest = ref<any>(null)
const submitting = ref(false)
const formError = ref('')
const toast = ref('')
const form = ref({ name: '', phone: '', note: 'ខាងប្រុស', rsvp_status: 'pending' })
const updatingRsvpId = ref('')
const updatingSideId = ref('')
const batchAssigning = ref(false)
const sideFilter = ref<'all' | 'groom' | 'bride' | 'unassigned'>('all')

const groomCount = computed(() => guests.value.filter(g => g.note && g.note.includes('ខាងប្រុស')).length)
const brideCount = computed(() => guests.value.filter(g => g.note && g.note.includes('ខាងស្រី')).length)
const unassignedCount = computed(() => guests.value.filter(g => !g.note || (!g.note.includes('ខាងប្រុស') && !g.note.includes('ខាងស្រី'))).length)

// Excel Import State
interface ParsedGuest {
  name: string
  phone: string
  note: string
  selected: boolean
  isDuplicate: boolean
}

const showImportModal = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const parsedImportGuests = ref<ParsedGuest[]>([])
const updateExistingGuests = ref(true)
const importing = ref(false)
const importError = ref('')

const siteUrl = config.public.siteUrl as string

const filteredGuests = computed(() => {
  let list = guests.value
  if (sideFilter.value === 'groom') {
    list = list.filter(g => g.note && g.note.includes('ខាងប្រុស'))
  } else if (sideFilter.value === 'bride') {
    list = list.filter(g => g.note && g.note.includes('ខាងស្រី'))
  } else if (sideFilter.value === 'unassigned') {
    list = list.filter(g => !g.note || (!g.note.includes('ខាងប្រុស') && !g.note.includes('ខាងស្រី')))
  }
  const q = search.value.toLowerCase().trim()
  if (!q) return list
  return list.filter(g =>
    (g.name && g.name.toLowerCase().includes(q)) ||
    (g.phone && g.phone.toLowerCase().includes(q)) ||
    (g.note && g.note.toLowerCase().includes(q))
  )
})

const paginatedGuests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredGuests.value.slice(start, start + pageSize.value)
})

watch([search, sideFilter], () => {
  currentPage.value = 1
})

const invitation = (g: any) => g.invitations?.[0]
const rsvp = (g: any) => invitation(g)?.rsvps?.[0]?.attendance_status

const selectedImportCount = computed(() =>
  parsedImportGuests.value.filter(g => g.selected).length
)

const isAllImportSelected = computed(() =>
  parsedImportGuests.value.length > 0 && parsedImportGuests.value.every(g => g.selected)
)

const toggleSelectAllImport = () => {
  const target = !isAllImportSelected.value
  parsedImportGuests.value.forEach(g => { g.selected = target })
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const onFileSelected = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    processExcelFile(files[0])
  }
}

const onFileDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files[0]) {
    processExcelFile(files[0])
  }
}

const clearImportFile = () => {
  parsedImportGuests.value = []
  importError.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const openImportModal = () => {
  clearImportFile()
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
  clearImportFile()
}

// Download Pre-formatted Cambodian Wedding Guest Excel Template matching Participant_Registry_2
const downloadExcelTemplate = () => {
  const wb = XLSX.utils.book_new()
  const templateData = [
    ['Name', 'Note'],
    ['Van Sopheamen', 'ខាងប្រុស'],
    ['Neak Bunhak', 'ខាងស្រី'],
    ['Chhoun Sophanith', 'ខាងប្រុស'],
    ['Srun Sundy', 'ខាងប្រុស'],
    ['Sela MonySathya', 'ខាងប្រុស'],
    ['Roth Brophea', 'ខាងប្រុស'],
    ['Nguon Sotheavuth', 'ខាងប្រុស'],
    ['Seng Sothearak', 'ខាងប្រុស'],
    ['Leng Chhinghor', 'ខាងប្រុស'],
    ['Chin Socheat', 'ខាងប្រុស'],
    ['Sok Bora', 'ខាងប្រុស'],
    ['Kranh Channak', 'ខាងប្រុស'],
    ['Khiev Kakda', 'ខាងប្រុស'],
    ['Eav Outdom', 'ខាងប្រុស'],
    ['Chhoeung Chhun Virak', 'ខាងប្រុស'],
    ['Sor Nga', 'ខាងប្រុស'],
    ['Hoeung Lo Vutha', 'ខាងប្រុស'],
    ['Phal Pisey', 'ខាងប្រុស'],
    ['Ean Mesa', 'ខាងប្រុស'],
    ['Phat Mady', 'ខាងប្រុស'],
    ['Yem Nayhouth', 'ខាងប្រុស'],
    ['Sun Seakly', 'ខាងប្រុស'],
    ['Yon Kansovannary', 'ខាងប្រុស'],
    ['Choun Pechsovann', 'ខាងប្រុស'],
    ['Pan Sam Orn', 'ខាងប្រុស']
  ]
  const ws = XLSX.utils.aoa_to_sheet(templateData)
  ws['!cols'] = [{ wch: 25 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, ws, 'Participant_Registry_2')
  XLSX.writeFile(wb, 'Participant_Registry_2.xlsx')
  showToast('✓ Template downloaded: Participant_Registry_2.xlsx')
}

// Parse Spreadsheet (.xlsx, .xls, .csv) with Smart Column Detection
const processExcelFile = async (file: File) => {
  importError.value = ''
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })

    if (!workbook.SheetNames.length) {
      importError.value = 'No worksheets found in this Excel file.'
      return
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows: any[][] = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' })

    if (!rows.length) {
      importError.value = 'The uploaded Excel spreadsheet is empty.'
      return
    }

    // Existing guest names map for duplicate detection
    const existingNamesSet = new Set(
      guests.value.map(g => g.name.toLowerCase().trim())
    )

    // Detect column indexes for Name, Note/Side, and Phone
    let nameColIdx = 0
    let phoneColIdx = -1
    let noteColIdx = -1
    let startRowIdx = 0

    // Inspect the first 5 rows to identify header row
    for (let r = 0; r < Math.min(5, rows.length); r++) {
      const row = rows[r] || []
      let foundHeader = false

      for (let c = 0; c < row.length; c++) {
        const cell = String(row[c] || '').toLowerCase().trim()
        // Check for Name header keywords
        if (
          cell.includes('name') ||
          cell.includes('guest') ||
          cell.includes('ឈ្មោះ') ||
          cell.includes('កិត្តិយស') ||
          cell.includes('នាម')
        ) {
          nameColIdx = c
          foundHeader = true
        }
        // Check for Note / Side header keywords
        else if (
          cell.includes('note') ||
          cell.includes('side') ||
          cell.includes('ខាង') ||
          cell.includes('ចំណាំ') ||
          cell.includes('សម្គាល់') ||
          cell.includes('party') ||
          cell.includes('family')
        ) {
          noteColIdx = c
          foundHeader = true
        }
        // Check for Phone header keywords
        else if (
          cell.includes('phone') ||
          cell.includes('tel') ||
          cell.includes('mobile') ||
          cell.includes('contact') ||
          cell.includes('ទូរស័ព្ទ') ||
          cell.includes('លេខ')
        ) {
          phoneColIdx = c
          foundHeader = true
        }
      }

      if (foundHeader) {
        startRowIdx = r + 1
        break
      }
    }

    const parsed: ParsedGuest[] = []

    for (let i = startRowIdx; i < rows.length; i++) {
      const row = rows[i] || []
      const rawName = String(row[nameColIdx] || '').trim()

      // Skip empty or comment rows
      if (!rawName) continue

      let rawPhone = phoneColIdx >= 0 ? String(row[phoneColIdx] || '').trim() : ''
      let rawNote = noteColIdx >= 0 ? String(row[noteColIdx] || '').trim() : ''

      // Clean phone if numeric float from excel
      if (phoneColIdx >= 0 && typeof row[phoneColIdx] === 'number') {
        rawPhone = String(row[phoneColIdx])
      }

      const isDuplicate = existingNamesSet.has(rawName.toLowerCase())

      parsed.push({
        name: rawName,
        phone: rawPhone,
        note: rawNote,
        selected: true, // Default select all so user can easily sync side/note
        isDuplicate
      })
    }

    if (!parsed.length) {
      importError.value = 'Could not find any guest names in the uploaded spreadsheet.'
      return
    }

    parsedImportGuests.value = parsed
  } catch (err: any) {
    console.error('Error parsing Excel:', err)
    importError.value = `Failed to read file: ${err.message || 'Unknown format'}`
  }
}

// Quick 1-click side assignment for a single guest
const quickSetSide = async (guest: any, note: string) => {
  updatingSideId.value = guest.id
  const token = await getToken()
  try {
    await $fetch(`/api/admin/guests/${guest.id}`, {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: { name: guest.name, phone: guest.phone, note }
    })
    guest.note = note
    showToast(`✓ "${guest.name}" assigned to ${note}`)
  } catch (err: any) {
    showToast(`Error: ${err?.data?.statusMessage || err?.message || 'Failed'}`)
  } finally {
    updatingSideId.value = ''
  }
}

// Toggle guest side between ខាងប្រុស and ខាងស្រី on click
const toggleGuestSide = async (guest: any) => {
  const current = guest.note || ''
  const next = current.includes('ខាងប្រុស') ? 'ខាងស្រី' : 'ខាងប្រុស'
  await quickSetSide(guest, next)
}

// Batch assign all currently unassigned guests to ខាងប្រុស or ខាងស្រី
const batchAssignUnassigned = async (note: 'ខាងប្រុស' | 'ខាងស្រី') => {
  const unassigned = guests.value.filter(g => !g.note || (!g.note.includes('ខាងប្រុស') && !g.note.includes('ខាងស្រី')))
  if (!unassigned.length) return
  batchAssigning.value = true
  const token = await getToken()
  try {
    await $fetch('/api/admin/guests/batch', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        guest_ids: unassigned.map(g => g.id),
        note
      }
    })
    showToast(`✓ Successfully assigned ${unassigned.length} guests to ${note}!`)
    await fetchGuests()
  } catch (err: any) {
    showToast(`Error: ${err?.data?.statusMessage || err?.message || 'Failed'}`)
  } finally {
    batchAssigning.value = false
  }
}

// Execute batch import to server API
const executeImport = async () => {
  const selectedGuests = parsedImportGuests.value.filter(g => g.selected)
  if (!selectedGuests.length) {
    importError.value = 'Please select at least one guest to import.'
    return
  }

  importing.value = true
  importError.value = ''
  const token = await getToken()

  try {
    const payload = {
      guests: selectedGuests.map(g => ({
        name: g.name,
        phone: g.phone || null,
        note: g.note || ''
      })),
      update_existing: updateExistingGuests.value
    }

    const res: any = await $fetch('/api/admin/guests/import', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: payload
    })

    const updated = res?.updated || 0
    const inserted = res?.inserted || 0
    if (updated > 0 && inserted > 0) {
      showToast(`✓ Success: updated ${updated} guests & added ${inserted} new guests!`)
    } else if (updated > 0) {
      showToast(`✓ Success: updated ${updated} existing guests with their sides!`)
    } else {
      showToast(`✓ Successfully imported ${inserted || selectedGuests.length} guests!`)
    }
    closeImportModal()
    await fetchGuests()
  } catch (err: any) {
    importError.value = err?.data?.statusMessage || err?.message || 'Failed to import guests.'
  } finally {
    importing.value = false
  }
}

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetchGuests = async () => {
  loading.value = true
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/guests', {
    headers: { authorization: `Bearer ${token}` }
  }).catch(() => ({ data: [] }))
  guests.value = data || []
  loading.value = false
}

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

const updateRsvpStatus = async (guest: any, status: 'pending' | 'attending' | 'not_attending') => {
  updatingRsvpId.value = guest.id
  const token = await getToken()
  try {
    await $fetch('/api/admin/rsvps/status', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { guest_id: guest.id, status }
    })
    if (status === 'pending') {
      showToast(`✓ RSVP for "${guest.name}" reset back to Pending`)
    } else if (status === 'attending') {
      showToast(`✓ RSVP for "${guest.name}" marked as Attending`)
    } else {
      showToast(`✓ RSVP for "${guest.name}" marked as Declined`)
    }
    await fetchGuests()
  } catch (err: any) {
    showToast(`Error updating RSVP: ${err?.data?.statusMessage || err?.message || 'Failed'}`)
  } finally {
    updatingRsvpId.value = ''
  }
}

const openCreateModal = () => { editingGuest.value = null; form.value = { name: '', phone: '', note: 'ខាងប្រុស', rsvp_status: 'pending' }; formError.value = ''; showModal.value = true }
const openEditModal = (g: any) => { editingGuest.value = g; form.value = { name: g.name, phone: g.phone || '', note: g.note || '', rsvp_status: rsvp(g) || 'pending' }; formError.value = ''; showModal.value = true }
const closeModal = () => { showModal.value = false; editingGuest.value = null }

const submitGuest = async () => {
  submitting.value = true; formError.value = ''
  const token = await getToken()
  try {
    if (editingGuest.value) {
      await $fetch(`/api/admin/guests/${editingGuest.value.id}`, {
        method: 'PUT',
        headers: { authorization: `Bearer ${token}` },
        body: { name: form.value.name, phone: form.value.phone, note: form.value.note }
      })

      // Update RSVP status if changed
      const currentRsvp = rsvp(editingGuest.value) || 'pending'
      if (form.value.rsvp_status && form.value.rsvp_status !== currentRsvp) {
        await $fetch('/api/admin/rsvps/status', {
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
          body: { guest_id: editingGuest.value.id, status: form.value.rsvp_status }
        })
      }

      showToast('Guest updated.')
    } else {
      await $fetch('/api/admin/guests', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
        body: { name: form.value.name, phone: form.value.phone, note: form.value.note }
      })
      showToast('Guest added with invitation link.')
    }
    closeModal(); await fetchGuests()
  } catch (e: any) { formError.value = e?.data?.statusMessage || 'Error saving guest.' }
  submitting.value = false
}

const confirmDelete = (g: any) => { deletingGuest.value = g }
const deleteGuest = async () => {
  if (!deletingGuest.value) return
  submitting.value = true
  const token = await getToken()
  try {
    await $fetch(`/api/admin/guests/${deletingGuest.value.id}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } })
    showToast('Guest deleted.'); deletingGuest.value = null; await fetchGuests()
  } catch { showToast('Error deleting guest.') }
  submitting.value = false
}

const copyLink = async (g: any) => {
  const token = invitation(g)?.token
  if (!token) return showToast('No invitation link yet.')
  const url = `${siteUrl}/invite/${token}`
  await navigator.clipboard.writeText(url)
  showToast('Invitation link copied!')
}

onMounted(fetchGuests)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.btn-icon { @apply w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F0E3] transition-colors text-base; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
.badge-success { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700; }
.badge-error { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700; }
.badge-neutral { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-md shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
