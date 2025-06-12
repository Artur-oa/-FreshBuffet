import React from "react"
import { NavLink, useNavigate } from "react-router"
import UserApi from "../../entities/user/UserApi"

function Header({ user, setUser }) {

const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const data = await UserApi.logout()
      // console.log(data)
      if (data.statusCode === 200) {
        setUser(null)
        navigate('/recipes')
      } else {
        console.log(data.error)
      }
    } catch (error) {
      console.log(error)
      return alert(error.response.data.error)
    }
  }

  return (
    <header className='p-4 bg-gray-100 text-center'>
      <h1 className='text-xl font-semibold'>🍽️ Fresh Buffet</h1>


    
      <div className="max-w-700 center wrap-float">
        <nav className="clearfix mar-b-1">
          <ul className="no-bullets no-margin no-padding right">
            <li className="pipe-separate t-light-green left">
              <NavLink to="/">Главная страница</NavLink>
            </li>
            {user ? (
              <li className="pipe-separate t-light-green left" onClick={logoutHandler}>
                <NavLink to="/">Выйти</NavLink>
              </li>
            ) : (
              <>
                <li className="pipe-separate t-light-green left">
                  <NavLink to="/auth">Войти</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
export default Header;
