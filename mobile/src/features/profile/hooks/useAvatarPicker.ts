import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
import { useUploadAvatar } from './useProfile';

export function useAvatarPicker() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: uploadAvatar } = useUploadAvatar();

  const pickFromCamera = useCallback(async () => {
    try {
      const result = await ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      setIsLoading(true);
      await uploadAvatar(result.path);
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(t('common.error'), t('profile.avatarUploadFailed'));
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
        mediaType: 'photo',
      });

      setIsLoading(true);
      await uploadAvatar(result.path);
    } catch (error: any) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert(t('common.error'), t('profile.avatarUploadFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [uploadAvatar, t]);

  const showPicker = useCallback(() => {
    Alert.alert(t('profile.changeAvatar'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.takePhoto'), onPress: pickFromCamera },
      { text: t('profile.chooseFromLibrary'), onPress: pickFromGallery },
    ]);
  }, [pickFromCamera, pickFromGallery, t]);

  return { showPicker, isLoading };
}
