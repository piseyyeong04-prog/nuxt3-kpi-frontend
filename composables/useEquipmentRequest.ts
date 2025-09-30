import type { EquipmentRequest } from "~/types/equipment";

export const useEquipmentRequest = () => {
  const createEquipmentRequest = async (requestData: Omit<EquipmentRequest, 'id' | 'date_created' | 'user_created'>) => {
    try {
      const response = await useApi<EquipmentRequest>('/items/equipment_request', {
        method: 'POST',
        data: requestData
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const getEquipmentRequests = async () => {
    try {
      const response = await useApi<{ data: EquipmentRequest[] }>(
        '/items/equipment_request?filter[status]=published&fields=id,user_created.first_name,user_created.last_name,user_created.id,user_created.title,user_created.department.*,shooting_time.id,shooting_time.name,shooting_date,return_date,microphone.id,microphone.name,camera.id,camera.name,tripod.id,tripod.name,gimbal.id,gimbal.name,camera_lens.id,camera_lens.name,light.id,light.name,drone.id,drone.name',
        {
          method: 'GET'
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateEquipmentRequest = async (id: string, requestData: Partial<EquipmentRequest>) => {
    try {
      const response = await useApi<EquipmentRequest>(`/items/equipment_request/${id}`, {
        method: 'PATCH',
        data: requestData
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteEquipmentRequest = async (id: string) => {
    try {
      await useApi(`/items/equipment_request/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      throw error;
    }
  };

  return {
    createEquipmentRequest,
    getEquipmentRequests,
    updateEquipmentRequest,
    deleteEquipmentRequest
  };
};