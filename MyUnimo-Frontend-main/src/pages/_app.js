// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Config Imports
import themeConfig from 'src/configs/ThemeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'

// const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (

    // <CacheProvider value={emotionCache}>
    <>
      <Head>
        <title>{`${themeConfig.templateName} - Helping immigrants on their journey`}</title>
        <meta name='description'
          content={`${themeConfig.templateName} – Helping immigrants on their journey`}/>
        <meta name='keywords' content='Helping immigrants on their journey'/>
        <meta name='viewport' content='initial-scale=1, width=device-width'/>
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({settings}) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    {/* </CacheProvider> */}
    </>
  )
}

export default App
