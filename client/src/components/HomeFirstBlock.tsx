import { useTranslation } from 'react-i18next';
import classes from './styles/home.module.css';

export const HomeFirstBlock = () => {
	const { t } = useTranslation();
	return (
		<div className={classes.wrapper}>
			<h1>{t('welcome')}</h1>
			<p>{t('description')}</p>
		</div>
	);
};
