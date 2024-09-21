import { useSelector } from "react-redux";

export function useAuth() {
  const savedUser = JSON.parse(sessionStorage.getItem('user'));

  const { email, token, id } = useSelector((state) => state.user || {});

  return {
    isAuth: !!(email || savedUser?.email),
    email: email || savedUser?.email || null,
    token: token || savedUser?.token || null,
    id: id || savedUser?.id || null,
  };
}
