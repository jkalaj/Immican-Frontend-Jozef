// ** Demo Components Imports
import Login from 'src/pages/login/index'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const MainPage = () => {
  return (
    <Login />
  )
}

MainPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default MainPage
