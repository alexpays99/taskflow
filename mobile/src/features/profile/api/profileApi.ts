import { User } from "@/features/auth/types";
import apiClient from "@/shared/api/client";
import { ENDPOINTS } from "@/shared/constants";

interface UpdateProfileData {
  name?: string;
}

export const profileApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(ENDPOINTS.users.me);
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await apiClient.patch<User>(ENDPOINTS.users.me, data);
    return response.data;
  },

  uploadAvatar: async (imagePath: string): Promise<User> => {
    const formData = new FormData();
    const filename = imagePath.split("/").pop() || "avatar.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : "jpeg";
    const type = `image/${ext === "jpg" ? "jpeg" : ext}`;

    formData.append("avatar", {
      uri: imagePath,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<User>(
      ENDPOINTS.users.avatar,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  deleteAvatar: async (): Promise<User> => {
    const response = await apiClient.delete<User>(ENDPOINTS.users.avatar);
    return response.data;
  },
};
