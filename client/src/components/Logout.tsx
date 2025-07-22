import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useState } from 'react';
import { useDashboardContext } from '../pages/Layout';
import style from '../components/styles/logout.module.css';

const Logout = () => {
	const [showLogout, setShowLogout] = useState(false);
	const { user, logoutUser } = useDashboardContext();

	return (
		<div className={style.cont}>
			{user ? (
				<div>
					<button
						type="button"
						className="btn logout-btn"
						onClick={() => setShowLogout(!showLogout)}
					>
						<FaUserCircle />
						<div>
							<span>{user.name}</span>
						</div>
						<FaCaretDown />
					</button>
					<div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
						<button type="button" className="dropdown-btn" onClick={logoutUser}>
							logout
						</button>
					</div>
				</div>
			) : (
				<span>Not logged</span>
			)}
		</div>
	);
};

export default Logout;
