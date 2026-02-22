import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { LoginUI } from '../../components/ui/pages/login';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(undefined);
    dispatch(loginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      } else {
        setErrorText('Ошибка входа. Проверьте email и пароль.');
      }
    });
  };

  return (
    <LoginUI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={errorText}
    />
  );
};
