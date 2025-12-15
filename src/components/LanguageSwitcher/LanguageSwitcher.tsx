import React from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      style={{ width: 80 }}
      suffixIcon={<GlobalOutlined />}
      options={[
        { label: 'VN', value: 'vi' },
        { label: 'EN', value: 'en' },
      ]}
    />
  );
};

export default LanguageSwitcher;

