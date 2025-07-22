import { useTranslation } from 'react-i18next';

const About = () => {
	const { t } = useTranslation();

	return <div>{t('aboutPage')}</div>;
};

export default About;
