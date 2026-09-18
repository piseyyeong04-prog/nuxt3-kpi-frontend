// composables/usePermissions.ts
import { computed } from 'vue'
import { useAuthStore } from '~/store/useAuthStore'

export function usePermissions() {
  const auth = useAuthStore()
  const adminRoleId = '3a5cb98e-02f8-4f09-afd9-dcd43288c756'
  const saleRoleId = 'a7b9388a-9f74-4a0d-afd4-741f0f488ec2'
  // creator roldid
  const creatorRoleId = '487171a6-b731-4d96-b350-3481868c8f92'
  // Writer roleID
  const writerRoleId = 'bb5d4a67-a17e-4cdf-9d59-c8f95518797b'
  // hrRoleId
  const hrRoleId = '90feab0a-4641-44bc-91ea-806387b95230'
  // editor roleID
  const editorRoleId = 'fe656e58-5b01-496f-ac9c-9c3fadca70af'

  const isAdmin = computed(() => {
    return auth.user?.role?.id === adminRoleId
  })
  const isSale = computed(() => {
    return auth.user?.role?.id === saleRoleId
  })
  const isHr = computed(() => {
    return auth.user?.role?.id === hrRoleId
  })
  const isCreator = computed(() => {
    return auth.user?.role?.id === creatorRoleId
  })

  const isWriter = computed(() => {
    return auth.user?.role?.id === writerRoleId
  })

  const isEditor = computed(() => {
    return auth.user?.role?.id === editorRoleId || auth.user?.role?.id === 'af115dbc-3aad-4879-8c1e-5ed0059ec576'
  })

  return {
    isAdmin,
    isSale,
    isHr,
    isCreator,
    isWriter,
    isEditor
  }
}
