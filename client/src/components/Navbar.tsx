import { NavLink } from 'react-router-dom';
import classes from './styles/nav.module.css';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import Logout from './Logout.tsx';

import { useDashboardContext } from '../pages/Layout';

export const Navbar = () => {
	const { user } = useDashboardContext();

	return (
		<nav className={classes.nav}>
			<ul>
				<li>
					<NavLink
						className={({ isActive }) => (isActive ? classes.active : undefined)}
						to="/"
					>
						Home
					</NavLink>
				</li>
				<li>
					<NavLink
						className={({ isActive }) => (isActive ? classes.active : undefined)}
						to="/about"
					>
						About
					</NavLink>
				</li>
				{user?.role === 'admin' && (
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? classes.active : undefined)}
							to="/admin"
						>
							Admin
						</NavLink>
					</li>
				)}
				{!user && (
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? classes.active : undefined)}
							to="/login"
						>
							Login
						</NavLink>
					</li>
				)}

				<li>
					<NavLink
						className={({ isActive }) => (isActive ? classes.active : undefined)}
						to="/register"
					>
						Register
					</NavLink>
				</li>
				{user?.role === 'admin' && (
					<li>
						<NavLink
							className={({ isActive }) => (isActive ? classes.active : undefined)}
							to="/addproduct"
						>
							Add Product
						</NavLink>
					</li>
				)}
			</ul>
			<div className={classes.headerSetting}>
				<ThemeToggle />
				<LanguageSwitcher />
				<Logout />
			</div>
		</nav>
	);
};

export default Navbar;
