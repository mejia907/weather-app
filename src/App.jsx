import { LoadingButton } from '@mui/lab'
import { Box, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'


const INITIAL_STATE = {
  city: '',
  country: '',
  temp: '',
  condition: '',
  icon: '',
  conditionText: '',
}

const INITIAL_ERROR = {
  error: false,
  message: ''
}

const API_WEATHER = `${import.meta.env.VITE_API_URL}?key=${import.meta.env.VITE_API_KEY}&q=`

function App() {

  const [ city, setCity ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const [ error, setError ] = useState(INITIAL_ERROR)
  const [ weather, setWeather ] = useState(INITIAL_STATE)

  const handleSearchCity = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(INITIAL_ERROR)
    try {
      if(!city.trim()) throw { message: 'Debe digitar una ciudad' }
      const response = await fetch(`${API_WEATHER}${city}`)
      const data = await response.json()
      if(data.error) throw { message: data.error.message }

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text
      })
      
    } catch (error) {
      setError({
        error: true,
        message: error.message
      })
    } finally {
      setLoading(false)
    }

  }

  return (
    <Container maxWidth='xs' sx={{ mt:2 }}>
      <Typography variant='h3' component='h1' align='center' gutterBottom>
        Weather APP
      </Typography>
      <Box sx={{ display:'grid', gap:2 }} component='form' autoComplete='off' onSubmit={handleSearchCity}>
        <TextField value={city} id='city' label='Ciudad' variant='outlined' required fullWidth onChange={(event) => setCity(event.target.value)} error={error.error} helperText={error.message} />
        <LoadingButton type='submit' variant='contained' loading={loading} loadingIndicator='Cargando...'>
          Buscar
        </LoadingButton>
      </Box>
      {weather.city && (
        <Box sx={{ mt:2, display:'grid', gap:2, textAlign:'center' }}>
          <Typography variant='h4' component='h2'>
            {weather.city}, {weather.country}
          </Typography>
          <Box component='img' alt={weather.conditionText} src={weather.icon} sx={{ margin: '0 auto' }} />
          <Typography variant='h5' component='h3'>
            {weather.temp} °C
          </Typography>
          <Typography variant='h6' component='h4'>
            {weather.conditionText}
          </Typography>
        </Box>
      )}
      <Typography textAlign='center' sx={{ mt:2, fontSize: '12px'}}>
        Powered by : {''}
        <a href='https://www.weatherapi.com/' title='Weather API'>WeatherAPI.com</a>
      </Typography>

    </Container>
  )
}

export default App
