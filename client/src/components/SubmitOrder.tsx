import axios from 'axios';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
// import InputMask from 'react-input-mask';
import { IMaskInput } from 'react-imask';

import ReCAPTCHA from 'react-google-recaptcha';

interface SubmitOrderProps {
	productName: string;
}

const SubmitOrder: React.FC<SubmitOrderProps> = ({ productName }) => {
	const [form, setForm] = useState({
		name: '',
		phone: '',
		messenger: 'Telegram',
	});

	const [captchaToken, setCaptchaToken] = useState('');
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
	const handleChange = (e: InputChangeEvent) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleCaptchaChange = (token: string | null) => {
		setCaptchaToken(token || '');
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
				<IMaskInput
					mask="+{38} (000) 000-00-00"
					definitions={{ '0': /\d/ }}
					unmask={false}
					name="phone"
					value={form.phone}
					onAccept={(value: string) => setForm((prev) => ({ ...prev, phone: value }))}
					required
				/>
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
