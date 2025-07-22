import axios from 'axios';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import InputMask from 'react-input-mask-next';
import ReCAPTCHA from 'react-google-recaptcha';

const SubmitOrder = ({ productName }) => {
	const [form, setForm] = useState({
		name: '',
		phone: '',
		messenger: 'Telegram',
	});

	const [captchaToken, setCaptchaToken] = useState('');
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleCaptchaChange = (token) => {
		setCaptchaToken(token || '');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!form.name || !form.phone) {
			toast.error('Please fill in all fields');
			return;
		}

		if (!captchaToken) {
			toast.error('Please confirm that you are not a robot');
			return;
		}

		setIsSubmitting(true);

		try {
			await axios.post('/api/v1/posts/contact', {
				...form,
				product: productName,
				captchaToken,
			});
			toast.success('Request sent!');
			setForm({ name: '', phone: '', messenger: 'Telegram' });
			setCaptchaToken('');

			if (recaptchaRef.current) {
				recaptchaRef.current.reset();
			}
		} catch (err) {
			toast.error('Error');
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<input type="hidden" name="product" value={productName} />

			<div>
				<label>Name:</label>
				<input
					type="text"
					name="name"
					value={form.name}
					onChange={handleChange}
					required
				/>
			</div>

			<div>
				<label>Phone:</label>
				<InputMask
					mask="+38 (099) 999-99-99"
					value={form.phone}
					onChange={handleChange}
					name="phone"
					required
				>
					<input type="tel" />
				</InputMask>
			</div>

			<div>
				<label>Your messenger:</label>
				<select name="messenger" value={form.messenger} onChange={handleChange}>
					<option value="Telegram">Telegram</option>
					<option value="Viber">Viber</option>
					<option value="WhatsApp">WhatsApp</option>
				</select>
			</div>
			<br />
			<ReCAPTCHA
				sitekey="6Ld9_2UrAAAAAAHl_KFMGmCuqM-hhtk7NhCwOgXj"
				onChange={handleCaptchaChange}
				ref={recaptchaRef}
			/>

			<br />

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Sending...' : 'Send'}
			</button>
		</form>
	);
};

export default SubmitOrder;
