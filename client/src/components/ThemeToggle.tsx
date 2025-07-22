import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDashboardContext } from '../pages/Layout';

const ThemeToggle = () => {
	const { isDarkTheme, toggleDarkTheme } = useDashboardContext();

	return (
		<div onClick={toggleDarkTheme}>
			{isDarkTheme ? (
				<BsFillSunFill className="toggle-icon" />
			) : (
				<BsFillMoonFill className="toggle-icon" />
			)}
		</div>
	);
};

export default ThemeToggle;
