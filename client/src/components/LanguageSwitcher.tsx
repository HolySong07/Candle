import { useTranslation } from 'react-i18next';
import classes from './styles/nav.module.css';

const LanguageSwitcher: React.FC = () => {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	const languages = [
		{ code: 'en', label: 'EN' },
		{ code: 'de', label: 'DE' },
		{ code: 'uk', label: 'UA' },
	];

	return (
		<div>
			{languages.map((lang) => (
				<button
					key={lang.code}
					onClick={() => changeLanguage(lang.code)}
					className={i18n.language === lang.code ? `${classes.active}` : ''}
				>
					{lang.label}
				</button>
			))}
		</div>
	);
};

export default LanguageSwitcher;
