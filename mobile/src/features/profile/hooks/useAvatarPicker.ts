import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useUploadAvatar } from "./useProfile";

const openSettings = () => {
  Linking.openSettings();
};

interface PermissionTexts {
  title: string;
  message: string;
  buttonPositive: string;
  buttonNegative: string;
}

const requestCameraPermission = async (
  texts: PermissionTexts,
): Promise<boolean> => {
  if (Platform.OS !== "android") return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    texts,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export function useAvatarPicker() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: uploadAvatar } = useUploadAvatar();

  const pickFromCamera = useCallback(async () => {
    try {
      const hasPermission = await requestCameraPermission({
        title: t("profile.cameraPermissionTitle"),
        message: t("profile.cameraPermissionMessage"),
        buttonPositive: t("common.save"),
        buttonNegative: t("common.cancel"),
      });
      if (!hasPermission) {
        Alert.alert(t("common.error"), t("profile.cameraPermissionDenied"), [
          { text: t("common.cancel"), style: "cancel" },
          { text: t("common.openSettings"), onPress: openSettings },
        ]);
        return;
      }

      const result = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      setIsLoading(true);
      await uploadAvatar(result.path);
    } catch (error: any) {
      console.log("Camera error:", error);
      if (error.code !== "E_PICKER_CANCELLED") {
        const message =
          error.code === "E_NO_CAMERA_PERMISSION"
            ? t("profile.cameraPermissionDenied")
            : error.message || t("profile.avatarUploadFailed");
        Alert.alert(t("common.error"), message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadAvatar, t]);

  const pickFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: "photo",
      });

      setIsLoading(true);
      await uploadAvatar(result.path);
    } catch (error: any) {
      if (error.code !== "E_PICKER_CANCELLED") {
        Alert.alert(t("common.error"), t("profile.avatarUploadFailed"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadAvatar, t]);

  const showPicker = useCallback(() => {
    Alert.alert(t("profile.changeAvatar"), undefined, [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("profile.takePhoto"), onPress: pickFromCamera },
      { text: t("profile.chooseFromLibrary"), onPress: pickFromGallery },
    ]);
  }, [pickFromCamera, pickFromGallery, t]);

  return { showPicker, isLoading };
}
