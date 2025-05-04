import { useFormStatus } from "react-dom";
import './button.scss';

const Button = (
    {label, onClick, type = 'button'}
) => 
    {
        const {pending}=useFormStatus();
    return (
        <div className="button-container">
        <button
            type={type}
            onClick={onClick}
            disabled={pending}
            className={`login-button ${pending ? 'pending' : ''}`}
        >
            {label}
        </button>
        </div>
    );
    }
export default Button;