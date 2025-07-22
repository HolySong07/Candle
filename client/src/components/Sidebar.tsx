import classes from '../pages/styles/layout.module.css';
import sidebar from './styles/sidebar.module.css';
import { useTranslation } from 'react-i18next';
import { usePopularPosts } from '../hooks/usePopularPosts';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const { t, i18n } = useTranslation();
	const lang = i18n.language;

	const { data: posts, isLoading, isError } = usePopularPosts();

	if (isLoading) return <p>Loading popular posts...</p>;
	if (isError) return <p>Error.</p>;

	return (
		<div className={classes.sidebar}>
			<p className={sidebar.header}>{t('sidebarTitle')}</p>
			<ul className={sidebar.listSidebar}>
				{posts.map((post) => (
					<li key={post._id}>
						<Link to={`/posts/${post._id}`}>
							<strong>{post.title?.[lang] || post.title.en}</strong>
						</Link>
						<img src={post.imageUrl} alt={post.title?.[lang]} width={120} />
					</li>
				))}
			</ul>
		</div>
	);
};

export default Sidebar;
