import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import { RegisterUI } from '../../components/ui/pages/register';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText(undefined);
    dispatch(registerUser({ name: userName, email, password })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      } else {
        setErrorText('Ошибка регистрации. Попробуйте снова.');
      }
    });
  };

  return (
    <RegisterUI
      userName={userName}
      setUserName={setUserName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      errorText={errorText}
    />
  );
};
