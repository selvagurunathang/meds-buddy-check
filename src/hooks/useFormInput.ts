import { useState, useCallback } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export function useEmailInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setIsValid(emailRegex.test(val));
  }, []);

  return { value, onChange, isValid };
}

export function usePasswordInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [isValid, setIsValid] = useState(true);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    setIsValid(passwordRegex.test(val));
  }, []);

  return { value, onChange, isValid };
}
