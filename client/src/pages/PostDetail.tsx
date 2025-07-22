import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import customFetch from '../utils/customFetch';
import { Helmet } from 'react-helmet-async';
import Likes from '../components/Likes';
import classes from './styles/pdp.module.css';
import SubmitOrder from '../components/SubmitOrder';

type Post = {
	_id: string;
	title: string;
	content: string;
	createdAt: string;
	description: string;
	imageUrl: string;
	likes: string;
};

const fetchPost = async (id: string, lang: string): Promise<Post> => {
	//const res = await fetch(`http://localhost:5000/api/posts/${id}?lang=${lang}`);
	const res = await customFetch.get(`/posts/${id}?lang=${lang}`);

	if (res.status !== 200) throw new Error('Failed to fetch posts');
	return res.data;
};

const PostDetail: React.FC = () => {
	const { id } = useParams();
	const { i18n } = useTranslation();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['post', id, i18n.language],
		queryFn: () => fetchPost(id!, i18n.language),
		enabled: !!id, // только если id задан
	});

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Post not found</div>;

	//console.log(data);

	return (
		<>
			<Helmet>
				<title>{data.title} | Candles</title>
				<meta name="description" content={data.description} />
			</Helmet>
			<div className={classes.wrapper}>
				<div>{data.imageUrl && <img src={data.imageUrl} />}</div>
				<div className={classes.info}>
					<h1>{data.title}</h1>
					<Likes id={data._id} likes={data.likes} />
					<p>{data.content}</p>
				</div>
			</div>
			<small>{new Date(data.createdAt).toLocaleString()}</small>
			<p>Do you want to order your product?</p>
			<SubmitOrder productName={data.title} />
		</>
	);
};

export default PostDetail;
