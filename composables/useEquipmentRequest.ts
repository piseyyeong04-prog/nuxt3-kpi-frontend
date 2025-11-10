// composables/useEquipmentRequest.ts
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
        '/items/equipment_request?filter[status]=published&fields=id,user_created.first_name,user_created.last_name,user_created.id,user_created.title,user_created.department.*,shooting_time.id,shooting_time.name,shooting_date,return_date,microphone.microphone_id.id,microphone.microphone_id.name,camera.camera_id.id,camera.camera_id.name,tripod.tripod_id.id,tripod.tripod_id.name,gimbal.gimbal_id.id,gimbal.gimbal_id.name,camera_lens.camera_lens_id.id,camera_lens.camera_lens_id.name,light.light_id.id,light.light_id.name,drone.drone_id.id,drone.drone_id.name,program_name,content_creator.id,content_creator.first_name,content_creator.last_name,camera_man.id,camera_man.first_name,camera_man.last_name',
        {
          method: 'GET'
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateEquipmentRequest = async (id: string, requestData: Partial<Omit<EquipmentRequest, 'shooting_time'> & { shooting_time: number }>) => {
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