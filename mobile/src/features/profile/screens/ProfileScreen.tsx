import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Colors, SPACING } from '@/shared/constants';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { ProfileHeader } from '../components/ProfileHeader';
import { SettingsItem } from '../components/SettingsItem';
import { MainStackParamList } from '@/app/navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(t('auth.logout'), 'Are you sure you want to logout?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const handleChangeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'uk' : 'en';
    i18n.changeLanguage(newLang);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ProfileHeader user={user} />

        <View style={styles.section}>
          <SettingsItem
            label={t('profile.editProfile')}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingsItem
            label={t('profile.language')}
            value={i18n.language === 'en' ? 'English' : 'Українська'}
            onPress={handleChangeLanguage}
          />
        </View>

        <View style={styles.section}>
          <SettingsItem
            label={t('auth.logout')}
            onPress={handleLogout}
            showArrow={false}
            isDestructive
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  section: {
    marginTop: SPACING.md,
    backgroundColor: Colors.neutral.white,
    borderRadius: 0,
  },
});

export default ProfileScreen;
