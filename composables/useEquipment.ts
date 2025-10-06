// composables/useEquipment.ts
export const useEquipment = () => {
  const getMicrophones = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/microphone?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching microphones:', error)
      return []
    }
  }

  const getCameras = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/camera?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching cameras:', error)
      return []
    }
  }

  const getTripods = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/tripod?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching tripods:', error)
      return []
    }
  }

  const getGimbals = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/gimbal?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching gimbals:', error)
      return []
    }
  }

  const getCameraLens = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/camera_lens?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching camera lens:', error)
      return []
    }
  }

  const getLights = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/light?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching lights:', error)
      return []
    }
  }

  const getDrones = async () => {
    try {
      const response = await useApi<{ data: Array<{ id: number; name: string }> }>(
        '/items/drone?filter[status]=published&fields=id,name',
        { method: 'GET' }
      )
      return response.data || []
    } catch (error) {
      console.error('Error fetching drones:', error)
      return []
    }
  }

  return {
    getMicrophones,
    getCameras,
    getTripods,
    getGimbals,
    getCameraLens,
    getLights,
    getDrones
  }
}