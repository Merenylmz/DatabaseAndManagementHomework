import { Outlet } from 'react-router-dom'
import Menu from './Menu'

// Her sayfanın ortak iskeleti: üstte menü, altta o anki sayfa (Outlet)
function Duzen() {
  return (
    <>
      <Menu />
      <Outlet />
    </>
  )
}

export default Duzen
