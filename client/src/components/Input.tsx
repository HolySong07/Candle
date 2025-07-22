import { type ComponentPropsWithoutRef } from 'react';
import input from '../components/styles/input.module.css';

type InputProps = {
	label: string;
	id: string;
} & ComponentPropsWithoutRef<'input'>;

const Input = ({ label, id, ...props }: InputProps) => {
	return (
		<p className={input.inputBlock}>
			<label htmlFor={id}>{label}</label>
			<input id={id} {...props} />
		</p>
	);
};

export default Input;
